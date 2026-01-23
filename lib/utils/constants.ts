// Application constants

export const APP_NAME = 'Sphinx Reisen';
export const APP_DESCRIPTION = 'Your trusted travel partner';

// Tour categories
export const TOUR_CATEGORIES = [
  'Beach',
  'Mountain',
  'City',
  'Safari',
  'Adventure',
  'Cultural',
  'Cruise',
  'Other',
] as const;

// Travel durations
export const TRAVEL_TYPES = ['1 day', '2 days', '3 days', '1 week', '2 weeks'] as const;

// Booking statuses
export const BOOKING_STATUSES = ['pending', 'confirmed', 'cancelled'] as const;

// Currency types
export const CURRENCIES = ['USD', 'EUR'] as const;

// Supported locales
export const LOCALES = ['en', 'de'] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
export const MAX_IMAGES_PER_TOUR = 4;

// Cache TTL (in seconds)
export const CACHE_TTL = {
  TOURS: 600, // 10 minutes
  REVIEWS: 300, // 5 minutes
  TOUR_DETAIL: 600, // 10 minutes
};

// Rate limiting
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  MAX_AUTH_REQUESTS: 5,
};
