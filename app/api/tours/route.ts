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
      category?: string;
      onSale?: boolean | { $ne: boolean };
      $text?: { $search: string };
      $or?: Array<{ onSale?: boolean | { $exists: boolean } | null }>;
    };
    const filter: QueryFilter = {};

    // For public API, only show active tours by default
    if (query.isActive !== 'false') {
      filter.isActive = true;
    }

    if (query.category) {
      filter.category = query.category;
    }

    // Handle onSale filtering
    if (query.onSale === 'true') {
      filter.onSale = true;
    } else if (query.onSale === 'false') {
      filter.$or = [{ onSale: false }, { onSale: { $exists: false } }, { onSale: null }];
    }

    // Text search if provided
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    // Build sort options
    type SortOptions = Record<string, 1 | -1>;
    const sortOptions: SortOptions = {};
    const sortField = query.sortBy || 'sortOrder';
    sortOptions[sortField] = query.sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [tours, total] = await Promise.all([
      Tour.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Tour.countDocuments(filter),
    ]);

    return NextResponse.json({
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
