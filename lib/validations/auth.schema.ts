import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Password update schema
export const passwordUpdateSchema = z.object({
  oldPassword: z.string().optional(), // Only required if password already exists
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
