import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Testimonial } from '@/lib/db/models/testimonial.model';
import {
  successResponse,
  validateBody,
  validateQuery,
  verifyAdminAuth,
  withErrorHandler,
} from '@/lib/api/helpers';
import { createTestimonialSchema, testimonialQuerySchema } from '@/lib/validations/testimonial.schema';

export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    await connectDB();

    const { data: query, error } = validateQuery(request, testimonialQuerySchema);
    if (error) return error;

    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '50');
    const skip = (page - 1) * limit;

    const filter: { isActive?: boolean } = {};

    if (query.isActive === 'all') {
      // no filter
    } else if (query.isActive === 'false') {
      filter.isActive = false;
    } else {
      // public default: active only
      filter.isActive = true;
    }

    const sortField = query.sortBy || 'sortOrder';
    const sortDirection = query.sortOrder === 'desc' ? -1 : 1;

    const [testimonials, total] = await Promise.all([
      Testimonial.find(filter)
        .sort({ [sortField]: sortDirection, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        testimonials,
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

export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();

    const { data, error } = await validateBody(request, createTestimonialSchema);
    if (error) return error;

    const testimonial = await Testimonial.create(data);

    return successResponse({ testimonial }, 201);
  });
}
