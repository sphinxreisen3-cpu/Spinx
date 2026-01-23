import { z } from 'zod';

// Review creation schema (public)
export const createReviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase(),
  reviewText: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review cannot exceed 1000 characters'),
  rating: z.number().int().min(1, 'Rating must be 1-5').max(5, 'Rating must be 1-5'),
  tourId: z.string().min(1, 'Tour ID is required'),
});

// Review update schema (admin only)
export const updateReviewSchema = z.object({
  isApproved: z.boolean().optional(),
  reviewText: z.string().min(10).max(1000).optional(),
});

// Review query schema
export const reviewQuerySchema = z.object({
  tourId: z.string().optional(),
  isApproved: z.enum(['true', 'false']).optional(),
  page: z.string().regex(/^\d+$/).optional().default('1'),
  limit: z.string().regex(/^\d+$/).optional().default('10'),
});

// Type exports
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewQueryParams = z.infer<typeof reviewQuerySchema>;
