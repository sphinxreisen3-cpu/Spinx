import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Booking } from '@/lib/db/models/booking.model';
import {
  successResponse,
  errorResponse,
  validateBody,
  verifyAdminAuth,
  withErrorHandler,
} from '@/lib/api/helpers';
import { updateBookingSchema } from '@/lib/validations/booking.schema';

// GET /api/bookings/[id] - Get single booking (admin only)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    // Verify admin authentication
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();
    const { id } = await params;

    const booking = await Booking.findById(id).lean();

    if (!booking) {
      return errorResponse('Booking not found', 404);
    }

    return successResponse({ booking });
  });
}

// PUT /api/bookings/[id] - Update booking status (admin only)
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
    const { data, error } = await validateBody(request, updateBookingSchema);
    if (error) return error;

    // Convert travelDate if provided
    const updateData: Record<string, unknown> = { ...data };
    if (data.travelDate) {
      updateData.travelDate = new Date(data.travelDate);
    }

    // Update booking
    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!booking) {
      return errorResponse('Booking not found', 404);
    }

    return successResponse({ booking });
  });
}

// DELETE /api/bookings/[id] - Delete booking (admin only)
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

    // Hard delete booking
    const booking = await Booking.findByIdAndDelete(id).lean();

    if (!booking) {
      return errorResponse('Booking not found', 404);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  });
}
