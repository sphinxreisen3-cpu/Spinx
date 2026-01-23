import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITour extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true, maxlength: 100 },
    title_de: { type: String, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    travelType: {
      type: String,
      required: true,
      enum: ['1 day', '2 days', '3 days', '1 week', '2 weeks'],
    },
    category: { type: String, required: true, maxlength: 50 },
    description: { type: String, required: true, maxlength: 2000 },
    description_de: { type: String, maxlength: 2000 },
    longDescription: { type: String },
    longDescription_de: { type: String },
    highlights: [{ type: String }],
    highlights_de: [{ type: String }],
    location1: { type: String },
    location1_de: { type: String },
    location2: { type: String },
    location2_de: { type: String },
    location3: { type: String },
    location3_de: { type: String },
    location4: { type: String },
    location4_de: { type: String },
    location5: { type: String },
    location5_de: { type: String },
    location6: { type: String },
    location6_de: { type: String },
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
    slug: { type: String, required: true, unique: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    onSale: { type: Boolean, default: false },
    discount: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

TourSchema.index({ category: 1, isActive: 1 });
TourSchema.index({ onSale: 1, isActive: 1 });
TourSchema.index({ slug: 1 }, { unique: true });

export const Tour: Model<ITour> =
  mongoose.models.Tour || mongoose.model<ITour>('Tour', TourSchema);
