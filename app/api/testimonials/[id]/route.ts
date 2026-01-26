import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Testimonial } from '@/lib/db/models/testimonial.model';
import {
  successResponse,
  errorResponse,
  validateBody,
  verifyAdminAuth,
  withErrorHandler,
  isValidObjectId,
} from '@/lib/api/helpers';
import { updateTestimonialSchema } from '@/lib/validations/testimonial.schema';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse('Invalid ID format', 400);
    }

    const testimonial = await Testimonial.findById(id).lean();

    if (!testimonial) {
      return errorResponse('Testimonial not found', 404);
    }

    return successResponse({ testimonial });
  });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse('Invalid ID format', 400);
    }

    const { data, error } = await validateBody(request, updateTestimonialSchema);
    if (error) return error;

    const testimonial = await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();

    if (!testimonial) {
      return errorResponse('Testimonial not found', 404);
    }

    return successResponse({ testimonial });
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withErrorHandler(async () => {
    if (process.env.NODE_ENV !== 'development') {
      const auth = await verifyAdminAuth(_request);
      if (!auth.authenticated) return auth.error;
    }

    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return errorResponse('Invalid ID format', 400);
    }

    const testimonial = await Testimonial.findByIdAndDelete(id).lean();

    if (!testimonial) {
      return errorResponse('Testimonial not found', 404);
    }

    return successResponse({ deleted: true });
  });
}
