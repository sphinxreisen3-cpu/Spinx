import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Tour } from '@/lib/db/models/tour.model';
import {
  successResponse,
  errorResponse,
  validateBody,
  validateQuery,
  verifyAdminAuth,
  withErrorHandler,
  generateSlug,
} from '@/lib/api/helpers';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
import { createTourSchema, tourQuerySchema } from '@/lib/validations/tour.schema';

// GET /api/tours - Get all tours (public, with optional filters)
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    await connectDB();

    // Validate query parameters
    const { data: query, error } = validateQuery(request, tourQuerySchema);
    if (error) return error;

    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '12');
    const skip = (page - 1) * limit;

    // Build query filter
    type QueryFilter = {
      isActive?: boolean;
      category?: string | RegExp;
      primaryLocation?: RegExp;
      onSale?: boolean | { $ne: boolean };
      $or?: Array<Record<string, unknown>>;
      $and?: Array<Record<string, unknown>>;
    };
    const filter: QueryFilter = {};

    // For public API, only show active tours by default
    if (query.isActive !== 'false') {
      filter.isActive = true;
    }

    if (query.category) {
      filter.category = new RegExp(`^${escapeRegex(query.category)}$`, 'i');
    }

    if (query.primaryLocation) {
      filter.primaryLocation = new RegExp(`^${escapeRegex(query.primaryLocation)}$`, 'i');
    }

    // Handle onSale filtering
    if (query.onSale === 'true') {
      filter.onSale = true;
    } else if (query.onSale === 'false') {
      filter.$or = [{ onSale: false }, { onSale: { $exists: false } }, { onSale: null }];
    }

    // Search: use substring (regex) so typing any letter filters matches immediately
    const searchTerm = query.search?.trim();
    let finalFilter: Record<string, unknown> = { ...filter };
    if (searchTerm) {
      const searchRegex = new RegExp(escapeRegex(searchTerm), 'i');
      const searchOr = [
        { title: searchRegex },
        { title_de: searchRegex },
        { description: searchRegex },
        { description_de: searchRegex },
        { category: searchRegex },
        { category_de: searchRegex },
      ];
      const onSaleOr = finalFilter.$or;
      delete finalFilter.$or;
      const andParts: Record<string, unknown>[] = [finalFilter, { $or: searchOr }];
      if (onSaleOr) andParts.push({ $or: onSaleOr });
      finalFilter = { $and: andParts };
    }

    // Build sort options
    type SortOptions = Record<string, 1 | -1>;
    const sortOptions: SortOptions = {};
    const sortField = query.sortBy || 'sortOrder';
    sortOptions[sortField] = query.sortOrder === 'asc' ? 1 : -1;

    const [tours, total] = await Promise.all([
      Tour.find(finalFilter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Tour.countDocuments(finalFilter),
    ]);

    // Add caching headers for better performance
    const response = NextResponse.json({
      success: true,
      data: {
        tours,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
    });

    // Cache for 60 seconds, revalidate in background
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
  });
}

// POST /api/tours - Create new tour (admin only)
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    // Skip auth check in development for easier testing
    // TODO: Remove this in production
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();

    // Validate request body
    const { data, error } = await validateBody(request, createTourSchema);
    if (error) return error;

    // Generate slug if not provided
    const slug = data.slug || generateSlug(data.title);

    // Check for duplicate slug
    const existing = await Tour.findOne({ slug });
    if (existing) {
      return errorResponse('A tour with this slug already exists', 409);
    }

    // Create tour
    const tour = await Tour.create({
      ...data,
      slug,
    });

    return successResponse({ tour }, 201);
  });
}
