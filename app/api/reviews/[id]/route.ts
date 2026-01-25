import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/review.model';
import {
  successResponse,
  errorResponse,
  validateBody,
  verifyAdminAuth,
  withErrorHandler,
} from '@/lib/api/helpers';
import { updateReviewSchema } from '@/lib/validations/review.schema';

// GET /api/reviews/[id] - Get single review (public if approved)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    await connectDB();
    const { id } = await params;

    const review = await Review.findById(id).lean();

    if (!review) {
      return errorResponse('Review not found', 404);
    }

    // Public can only see approved reviews
    if (!review.isApproved) {
      return errorResponse('Review not found', 404);
    }

    return successResponse({ review });
  });
}

// PUT /api/reviews/[id] - Update review (admin only - for moderation)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    // Verify admin authentication
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();
    const { id } = await params;

    // Validate request body
    const { data, error } = await validateBody(request, updateReviewSchema);
    if (error) return error;

    // Update review
    const review = await Review.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!review) {
      return errorResponse('Review not found', 404);
    }

    return successResponse({ review });
  });
}

// DELETE /api/reviews/[id] - Delete review (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(async () => {
    // Verify admin authentication
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();
    const { id } = await params;

    // Hard delete review
    const review = await Review.findByIdAndDelete(id).lean();

    if (!review) {
      return errorResponse('Review not found', 404);
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  });
}
