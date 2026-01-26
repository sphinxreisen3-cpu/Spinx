import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Booking } from '@/lib/db/models/booking.model';
import {
  successResponse,
  validateBody,
  validateQuery,
  verifyAdminAuth,
  withErrorHandler,
} from '@/lib/api/helpers';
import { createBookingSchema, bookingQuerySchema } from '@/lib/validations/booking.schema';
import { broadcastNotification } from '@/lib/notifications';

// GET /api/bookings - Get all bookings (admin only)
export async function GET(request: NextRequest) {
  return withErrorHandler(async () => {
    // Verify admin authentication
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();

    // Validate query parameters
    const { data: query, error } = validateQuery(request, bookingQuerySchema);
    if (error) return error;

    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    // Build query filter
    type QueryFilter = {
      status?: string;
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
    };
    const filter: QueryFilter = {};

    if (query.status) {
      filter.status = query.status;
    }

    // Search by name, email, or trip
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { confirmTrip: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Build sort options
    type SortOptions = Record<string, 1 | -1>;
    const sortOptions: SortOptions = {};
    const sortField = query.sortBy || 'createdAt';
    sortOptions[sortField] = query.sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [bookings, total] = await Promise.all([
      Booking.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        bookings,
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

// POST /api/bookings - Create new booking (public)
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    await connectDB();

    // Validate request body
    const { data, error } = await validateBody(request, createBookingSchema);
    if (error) return error;

    // Create booking
    const booking = await Booking.create({
      ...data,
      travelDate: new Date(data.travelDate),
      status: 'pending',
    });

    // Broadcast notification to admin
    broadcastNotification('booking', {
      _id: booking._id,
      name: booking.name,
      email: booking.email,
      tourTitle: booking.tourTitle || booking.confirmTrip,
      travelDate: booking.travelDate,
      totalPrice: booking.totalPrice,
      currencySymbol: booking.currencySymbol || '$',
      status: booking.status,
    });

    return successResponse(
      {
        booking,
        message: 'Booking submitted successfully. We will contact you shortly.',
      },
      201
    );
  });
}
