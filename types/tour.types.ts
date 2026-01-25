// Type definitions for tours
export interface Tour {
  _id: string;
  title: string;
  title_de?: string;
  price: number;
  priceEUR?: number;
  travelType: '1 day' | '2 days' | '3 days' | '1 week' | '2 weeks';
  travelType_de?: string;
  category: string;
  category_de?: string;
  description: string;
  description_de?: string;
  longDescription?: string;
  longDescription_de?: string;
  highlights?: string[];
  highlights_de?: string[];

  // Extended Content
  transportation?: string;
  transportation_de?: string;
  location?: string;
  location_de?: string;
  details?: string;
  details_de?: string;
  description2?: string;
  description2_de?: string;
  daysAndDurations?: string;
  daysAndDurations_de?: string;
  pickup?: string;
  pickup_de?: string;
  briefing?: string;
  briefing_de?: string;
  trip?: string;
  trip_de?: string;
  program?: string;
  program_de?: string;
  foodAndBeverages?: string;
  foodAndBeverages_de?: string;
  whatToTake?: string;
  whatToTake_de?: string;
  pickupLocation?: string;
  pickupLocation_de?: string;
  vanLocation?: string;
  vanLocation_de?: string;

  // Location Markers (6 stops)
  location1?: string;
  location1_de?: string;
  location2?: string;
  location2_de?: string;
  location3?: string;
  location3_de?: string;
  location4?: string;
  location4_de?: string;
  location5?: string;
  location5_de?: string;
  location6?: string;
  location6_de?: string;

  // Images (4 images)
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;

  // Status & Metadata
  slug: string;
  sortOrder: number;
  isActive: boolean;
  onSale: boolean;
  discount: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CreateTourInput {
  title: string;
  title_de?: string;
  price: number;
  priceEUR?: number;
  travelType: string;
  category: string;
  description: string;
  description_de?: string;
  longDescription?: string;
  longDescription_de?: string;
  highlights?: string[];
  highlights_de?: string[];
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  location1?: string;
  location1_de?: string;
  location2?: string;
  location2_de?: string;
  location3?: string;
  location3_de?: string;
  location4?: string;
  location4_de?: string;
  location5?: string;
  location5_de?: string;
  location6?: string;
  location6_de?: string;
  isActive?: boolean;
  onSale?: boolean;
  discount?: number;
}

export interface UpdateTourInput extends Partial<CreateTourInput> {
  isActive?: boolean;
  onSale?: boolean;
  discount?: number;
}
