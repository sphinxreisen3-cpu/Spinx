import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Testimonial } from '@/lib/db/models/testimonial.model';
import { successResponse, validateBody, withErrorHandler } from '@/lib/api/helpers';
import {
  createPublicTestimonialSchema,
  type CreatePublicTestimonialInput,
} from '@/lib/validations/testimonial.schema';

function pickAvatarColor(seed: string): 'blue' | 'green' | 'purple' {
  const options: Array<'blue' | 'green' | 'purple'> = ['blue', 'green', 'purple'];
  const normalized = seed.trim().toUpperCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash + normalized.charCodeAt(i) * (i + 1)) % 997;
  }
  return options[hash % options.length];
}

// POST /api/testimonials/public - Public submission endpoint
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    await connectDB();

    const { data, error } = await validateBody<CreatePublicTestimonialInput>(
      request,
      createPublicTestimonialSchema
    );
    if (error) return error;

    const testimonial = await Testimonial.create({
      name: data.name,
      country: data.country,
      initials: data.initials,
      text: data.text,
      image: pickAvatarColor(data.initials),
      sortOrder: 0,
      isActive: true,
    });

    return successResponse({ testimonial }, 201);
  });
}
