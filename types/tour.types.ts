// Type definitions for tours
export interface Tour {
  _id: string;
  title: string;
  title_de?: string;
  price: number;
  travelType: '1 day' | '2 days' | '3 days' | '1 week' | '2 weeks';
  category: string;
  description: string;
  description_de?: string;
  longDescription?: string;
  longDescription_de?: string;
  highlights?: string[];
  highlights_de?: string[];
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
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  onSale: boolean;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTourInput {
  title: string;
  title_de?: string;
  price: number;
  travelType: string;
  category: string;
  description: string;
  description_de?: string;
  longDescription?: string;
  longDescription_de?: string;
  highlights?: string[];
  highlights_de?: string[];
  locations?: {
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
  };
}

export interface UpdateTourInput extends Partial<CreateTourInput> {
  isActive?: boolean;
  onSale?: boolean;
  discount?: number;
}
