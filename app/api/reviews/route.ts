import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/review.model';
import { Tour } from '@/lib/db/models/tour.model';
import {
  successResponse,
  errorResponse,
  validateBody,
  validateQuery,
  withErrorHandler,
  isValidObjectId,
} from '@/lib/api/helpers';
import { createReviewSchema, reviewQuerySchema } from '@/lib/validations/review.schema';

// GET /api/reviews - Get reviews (public with filters)
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    await connectDB();

    // Validate query parameters
    const { data: query, error } = validateQuery(request, reviewQuerySchema);
    if (error) return error;

    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    // Build query filter
    type QueryFilter = {
      tourId?: string;
      isApproved?: boolean;
    };
    const filter: QueryFilter = {};

    // For public API, only show approved reviews by default
    if (query.isApproved !== 'false') {
      filter.isApproved = true;
    }

    if (query.tourId) {
      filter.tourId = query.tourId;
    }

    // Execute query with pagination
    const [reviews, total] = await Promise.all([
      Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(filter),
    ]);

    // Calculate average rating for tour if tourId provided
    let averageRating = null;
    if (query.tourId) {
      const stats = await Review.aggregate([
        { $match: { tourId: query.tourId, isApproved: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);
      if (stats.length > 0) {
        averageRating = {
          average: Math.round(stats[0].avgRating * 10) / 10,
          count: stats[0].count,
        };
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        averageRating,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  });
}

// POST /api/reviews - Submit new review (public)
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    await connectDB();

    // Validate request body
    const { data, error } = await validateBody(request, createReviewSchema);
    if (error) return error;

    // Validate tourId format
    if (!isValidObjectId(data.tourId)) {
      return errorResponse('Invalid tour ID', 400);
    }

    // Check if tour exists
    const tour = await Tour.findById(data.tourId);
    if (!tour) {
      return errorResponse('Tour not found', 404);
    }

    // Check for duplicate review (same email + tour)
    const existingReview = await Review.findOne({
      email: data.email,
      tourId: data.tourId,
    });
    if (existingReview) {
      return errorResponse('You have already submitted a review for this tour', 409);
    }

    // Create review (auto-approved for now, can change to false for moderation)
    const review = await Review.create({
      ...data,
      isApproved: true, // Set to false if you want manual moderation
    });

    return successResponse(
      {
        review,
        message: 'Review submitted successfully. Thank you for your feedback!',
      },
      201
    );
  });
}
