/**
 * Shared tour config: categories must match TourForm and DB values.
 */
export const TOUR_CATEGORIES = [
  'Cultural',
  'Adventure',
  'Historical',
  'Beach',
  'Desert',
  'Cruise',
] as const;

export type TourCategory = (typeof TOUR_CATEGORIES)[number];
