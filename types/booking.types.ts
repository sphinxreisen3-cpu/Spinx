// Type definitions for bookings
export interface Booking {
  _id: string;
  name: string;
  phone: string;
  email: string;
  adults: number;
  children: number;
  infants: number;
  travelDate: string;
  confirmTrip: string;
  tourTitle?: string;
  notes?: string;
  pickupLocation?: string;
  requirements?: string;
  totalPrice: number;
  currency: 'USD' | 'EUR';
  currencySymbol: '$' | '€';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  name: string;
  phone: string;
  email: string;
  adults: number;
  children?: number;
  infants?: number;
  travelDate: string;
  confirmTrip: string;
  tourTitle?: string;
  notes?: string;
  pickupLocation?: string;
  requirements?: string;
  totalPrice: number;
  currency?: 'USD' | 'EUR';
  currencySymbol?: '$' | '€';
}

export interface UpdateBookingInput {
  status?: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}
