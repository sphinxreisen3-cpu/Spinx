import { z } from 'zod';

// Tour creation schema
export const createTourSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  title_de: z.string().max(100).optional(),
  price: z.number().min(0, 'Price must be positive'),
  travelType: z.enum(['1 day', '2 days', '3 days', '1 week', '2 weeks']),
  travelType_de: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(50),
  category_de: z.string().max(50).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  description_de: z.string().max(2000).optional(),
  longDescription: z.string().max(5000).optional(),
  longDescription_de: z.string().max(5000).optional(),
  highlights: z.array(z.string()).optional(),
  highlights_de: z.array(z.string()).optional(),

  // Extended fields
  transportation: z.string().max(500).optional(),
  transportation_de: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  location_de: z.string().max(200).optional(),
  details: z.string().max(2000).optional(),
  details_de: z.string().max(2000).optional(),
  description2: z.string().max(2000).optional(),
  description2_de: z.string().max(2000).optional(),
  daysAndDurations: z.string().max(1000).optional(),
  daysAndDurations_de: z.string().max(1000).optional(),
  pickup: z.string().max(500).optional(),
  pickup_de: z.string().max(500).optional(),
  briefing: z.string().max(1000).optional(),
  briefing_de: z.string().max(1000).optional(),
  trip: z.string().max(2000).optional(),
  trip_de: z.string().max(2000).optional(),
  program: z.string().max(2000).optional(),
  program_de: z.string().max(2000).optional(),
  foodAndBeverages: z.string().max(1000).optional(),
  foodAndBeverages_de: z.string().max(1000).optional(),
  whatToTake: z.string().max(1000).optional(),
  whatToTake_de: z.string().max(1000).optional(),
  pickupLocation: z.string().max(500).optional(),
  pickupLocation_de: z.string().max(500).optional(),
  vanLocation: z.string().max(500).optional(),
  vanLocation_de: z.string().max(500).optional(),

  // Location markers (6 locations)
  location1: z.string().max(200).optional(),
  location1_de: z.string().max(200).optional(),
  location2: z.string().max(200).optional(),
  location2_de: z.string().max(200).optional(),
  location3: z.string().max(200).optional(),
  location3_de: z.string().max(200).optional(),
  location4: z.string().max(200).optional(),
  location4_de: z.string().max(200).optional(),
  location5: z.string().max(200).optional(),
  location5_de: z.string().max(200).optional(),
  location6: z.string().max(200).optional(),
  location6_de: z.string().max(200).optional(),

  // Images
  image1: z.string().optional(),
  image2: z.string().optional(),
  image3: z.string().optional(),
  image4: z.string().optional(),

  // Status fields
  slug: z.string().optional(), // Generated from title if not provided
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional().default(true),
  onSale: z.boolean().optional().default(false),
  discount: z.number().min(0).max(100).optional().default(0),
});

// Tour update schema (all fields optional)
export const updateTourSchema = createTourSchema.partial();

// Query params schema
export const tourQuerySchema = z.object({
  category: z.string().optional(),
  onSale: z.enum(['true', 'false']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).optional().default('1'),
  limit: z.string().regex(/^\d+$/).optional().default('12'),
  sortBy: z.enum(['createdAt', 'price', 'title', 'sortOrder']).optional().default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Type exports
export type CreateTourInput = z.infer<typeof createTourSchema>;
export type UpdateTourInput = z.infer<typeof updateTourSchema>;
export type TourQueryParams = z.infer<typeof tourQuerySchema>;
