import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  phone: string;
  email: string;
  adults: number;
  children: number;
  infants: number;
  travelDate: Date;
  confirmTrip: string;
  tourTitle?: string;
  message?: string;
  notes?: string;
  pickupLocation?: string;
  pickupLocationOutside?: string;
  requirements?: string;
  totalPrice: number;
  currency: 'USD' | 'EUR';
  currencySymbol: '$' | '€';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    adults: { type: Number, required: true, min: 1, max: 20 },
    children: { type: Number, default: 0, min: 0, max: 20 },
    infants: { type: Number, default: 0, min: 0, max: 20 },
    travelDate: { type: Date, required: true },
    confirmTrip: { type: String, required: true },
    tourTitle: { type: String },
    message: { type: String, maxlength: 1000 },
    notes: { type: String, maxlength: 1000 },
    pickupLocation: { type: String, maxlength: 200 },
    pickupLocationOutside: { type: String, maxlength: 200 },
    requirements: { type: String, maxlength: 100 },
    totalPrice: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'EUR'], default: 'USD' },
    currencySymbol: { type: String, enum: ['$', '€'], default: '$' },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
);

BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ travelDate: 1 });

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
