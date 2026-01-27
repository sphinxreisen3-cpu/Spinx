export interface HomeSaleTourCard {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  originalPrice: string;
  discountedPrice: string;
  discount: number;
  image: string;
  description: string;
}

export interface HomeTourCard {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  rating: number;
  price: string;
  image: string;
  description: string;
}

export interface HomeLatestTripCard {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  duration: string;
  rating: number;
  price: string;
  originalPrice?: string;
  discount?: number;
  isOnSale: boolean;
}

export interface HomeTestimonial {
  id: string;
  name: string;
  country?: string;
  role?: string;
  role_de?: string;
  initials: string;
  image: string;
  text: string;
  text_de?: string;
}
