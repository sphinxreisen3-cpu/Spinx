import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Tour } from '@/lib/db/models/tour.model';
import {
  successResponse,
  errorResponse,
  validateBody,
  verifyAdminAuth,
  withErrorHandler,
  isValidObjectId,
  generateSlug,
} from '@/lib/api/helpers';
import { updateTourSchema } from '@/lib/validations/tour.schema';

// GET /api/tours/[id] - Get single tour (public)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    await connectDB();
    const { id } = await params;

    // Find by MongoDB ObjectId or by slug
    const query = isValidObjectId(id) ? { _id: id } : { slug: id };

    const tour = await Tour.findOne({
      ...query,
      isActive: true,
    }).lean();

    if (!tour) {
      return errorResponse('Tour not found', 404);
    }

    const response = successResponse({ tour });
    
    // Cache for 5 minutes, revalidate in background (tours change less frequently)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  });
}

// PUT /api/tours/[id] - Update tour (admin only)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    // Skip auth check in development mode for testing
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();
    const { id } = await params;

    // Validate request body
    const { data, error } = await validateBody(request, updateTourSchema);
    if (error) return error;

    // If title is being updated and no new slug, generate new slug
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }

    const current = await Tour.findById(id).select('slug previousSlugs').lean();
    if (!current) {
      return errorResponse('Tour not found', 404);
    }

    // When slug changes: add old slug to previousSlugs for redirect handling
    const slugChanged = data.slug != null && data.slug !== current.slug;
    const updatePayload: Record<string, unknown> = { ...data };
    if (slugChanged) {
      const existing = await Tour.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return errorResponse('A tour with this slug already exists', 409);
      }
      updatePayload.previousSlugs = [...(current.previousSlugs || []), current.slug].filter(
        (s, i, arr) => arr.lastIndexOf(s) === i
      );
    }

    // Update tour
    const tour = await Tour.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).lean();

    if (!tour) {
      return errorResponse('Tour not found', 404);
    }

    return successResponse({ tour });
  });
}

// DELETE /api/tours/[id] - Permanently delete tour (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    // Skip auth check in development mode for testing
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(_request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();
    const { id } = await params;

    // Permanently delete the tour
    const tour = await Tour.findByIdAndDelete(id).lean();

    if (!tour) {
      return errorResponse('Tour not found', 404);
    }

    return NextResponse.json({
      success: true,
      message: 'Tour permanently deleted successfully',
    });
  });
}
