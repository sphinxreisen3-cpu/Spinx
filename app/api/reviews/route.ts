import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/review.model';
import { Tour } from '@/lib/db/models/tour.model';
import mongoose from 'mongoose';
import {
  successResponse,
  errorResponse,
  validateBody,
  validateQuery,
  verifyAdminAuth,
  withErrorHandler,
  isValidObjectId,
} from '@/lib/api/helpers';
import { createReviewSchema, reviewQuerySchema } from '@/lib/validations/review.schema';
import { broadcastNotification } from '@/lib/notifications';

// GET /api/reviews - Get reviews (public with filters)
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    await connectDB();

    // Validate query parameters
    const { data: query, error } = validateQuery(request, reviewQuerySchema);
    if (error) return error;

    const isAdminQuery = query.isApproved === 'false' || query.isApproved === 'all';
    if (isAdminQuery && process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    // Build query filter
    type QueryFilter = {
      tourId?: string | mongoose.Types.ObjectId;
      isApproved?: boolean;
    };
    const filter: QueryFilter = {};

    // For public API, only show approved reviews by default
    if (query.isApproved === 'false') {
      filter.isApproved = false;
    } else if (query.isApproved === 'all') {
      // no filter
    } else {
      filter.isApproved = true;
    }

    if (query.tourId) {
      // Convert string tourId to ObjectId for MongoDB query
      if (isValidObjectId(query.tourId)) {
        filter.tourId = new mongoose.Types.ObjectId(query.tourId);
      } else {
        return errorResponse('Invalid tour ID format', 400);
      }
    }

    // Execute query with pagination
    const [reviewsRaw, total] = await Promise.all([
      Review.find(filter)
        .populate({ path: 'tourId', select: 'title' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(filter),
    ]);

    const reviews = (reviewsRaw as unknown[]).map((review) => {
      const r = review as Record<string, unknown>;
      const tourIdValue = r.tourId as unknown;

      if (tourIdValue && typeof tourIdValue === 'object') {
        const t = tourIdValue as Record<string, unknown>;
        const tourTitle = typeof t.title === 'string' ? t.title : undefined;
        const tourId = '_id' in t ? String(t._id) : String(r.tourId);

        return {
          ...r,
          tourTitle,
          tourId,
        };
      }

      return {
        ...r,
        tourTitle: undefined,
        tourId: String(r.tourId),
      };
    });

    // Calculate average rating for tour if tourId provided
    let averageRating = null;
    if (query.tourId && isValidObjectId(query.tourId)) {
      const tourObjectId = new mongoose.Types.ObjectId(query.tourId);
      const stats = await Review.aggregate([
        { $match: { tourId: tourObjectId, isApproved: true } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);
      if (stats.length > 0) {
        averageRating = {
          average: Math.round(stats[0].avgRating * 10) / 10,
          count: stats[0].count,
        };
      }
    }

    const response = NextResponse.json({
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

    // Cache reviews for 60 seconds, revalidate in background
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    
    return response;
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

    // Broadcast notification to admin
    broadcastNotification('review', {
      _id: review._id,
      name: review.name,
      email: review.email,
      rating: review.rating,
      reviewText: review.reviewText?.substring(0, 100), // First 100 chars
      tourId: review.tourId,
      isApproved: review.isApproved,
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
