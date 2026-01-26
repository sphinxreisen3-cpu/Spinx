import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(2).max(100),
  country: z.string().min(2).max(100).optional(),
  role: z.string().max(100).optional(),
  role_de: z.string().max(100).optional(),
  initials: z.string().min(1).max(3),
  image: z.enum(['blue', 'green', 'purple']).optional().default('blue'),
  text: z.string().min(10).max(2000),
  text_de: z.string().max(2000).optional(),
  sortOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const createPublicTestimonialSchema = z.object({
  name: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  initials: z
    .string()
    .min(1)
    .max(3)
    .transform((v) => v.trim().toUpperCase()),
  text: z.string().min(10).max(2000),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export const testimonialQuerySchema = z.object({
  isActive: z.enum(['true', 'false', 'all']).optional(),
  page: z.string().regex(/^\d+$/).optional().default('1'),
  limit: z.string().regex(/^\d+$/).optional().default('50'),
  sortBy: z.enum(['createdAt', 'sortOrder']).optional().default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type CreatePublicTestimonialInput = z.infer<typeof createPublicTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type TestimonialQueryParams = z.infer<typeof testimonialQuerySchema>;
