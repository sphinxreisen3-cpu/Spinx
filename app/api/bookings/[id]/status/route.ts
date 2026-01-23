import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Booking } from '@/lib/db/models/booking.model';
import { verifyAdminAuth, errorResponse, withErrorHandler } from '@/lib/api/helpers';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

// PATCH /api/bookings/[id]/status - Update booking status (admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    // Verify admin authentication
    const auth = await verifyAdminAuth(request);
    if (!auth.authenticated) return auth.error;

    await connectDB();
    const { id } = await params;

    // Validate request body
    const body = await request.json();
    const result = statusSchema.safeParse(body);
    if (!result.success) {
      return errorResponse('Invalid status value', 400);
    }

    // Update booking status
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: result.data.status },
      { new: true }
    ).lean();

    if (!booking) {
      return errorResponse('Booking not found', 404);
    }

    return NextResponse.json({
      success: true,
      data: { booking },
    });
  });
}
