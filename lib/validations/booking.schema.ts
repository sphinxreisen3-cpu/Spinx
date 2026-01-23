import { z } from 'zod';

// Booking creation schema (public)
export const createBookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase(),
  phone: z.string().min(6, 'Phone must be at least 6 characters').max(30),
  adults: z.number().int().min(1, 'At least 1 adult required').max(20),
  children: z.number().int().min(0).max(20).optional().default(0),
  infants: z.number().int().min(0).max(20).optional().default(0),
  travelDate: z.string().refine((date) => {
    const parsed = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return parsed >= today;
  }, 'Travel date must be in the future'),
  confirmTrip: z.string().min(1, 'Tour selection is required'),
  tourTitle: z.string().optional(),
  pickupLocation: z.string().max(200).optional(),
  pickupLocationOutside: z.string().max(200).optional(),
  message: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
  requirements: z.string().max(100).optional(),
  totalPrice: z.number().min(0),
  currency: z.enum(['USD', 'EUR']).optional().default('USD'),
  currencySymbol: z.enum(['$', '€']).optional().default('$'),
});

// Booking update schema (admin only)
export const updateBookingSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  notes: z.string().max(1000).optional(),
  pickupLocation: z.string().max(200).optional(),
  travelDate: z.string().optional(),
});

// Booking query schema
export const bookingQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).optional().default('1'),
  limit: z.string().regex(/^\d+$/).optional().default('10'),
  sortBy: z.enum(['createdAt', 'travelDate', 'name', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Type exports
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
export type BookingQueryParams = z.infer<typeof bookingQuerySchema>;
