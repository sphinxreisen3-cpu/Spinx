import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITour extends Document {
  // Basic Info
  title: string;
  title_de?: string;
  price: number;
  priceEUR?: number;
  travelType: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const TourSchema = new Schema<ITour>(
  {
    // Basic Info
    title: { type: String, required: true, maxlength: 100 },
    title_de: { type: String, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    priceEUR: { type: Number, min: 0 },
    travelType: {
      type: String,
      required: true,
      enum: ['1 day', '2 days', '3 days', '1 week', '2 weeks'],
    },
    travelType_de: { type: String },
    category: { type: String, required: true, maxlength: 50 },
    category_de: { type: String, maxlength: 50 },
    description: { type: String, required: true, maxlength: 2000 },
    description_de: { type: String, maxlength: 2000 },
    longDescription: { type: String, maxlength: 5000 },
    longDescription_de: { type: String, maxlength: 5000 },
    highlights: [{ type: String }],
    highlights_de: [{ type: String }],

    // Extended Content
    transportation: { type: String, maxlength: 500 },
    transportation_de: { type: String, maxlength: 500 },
    location: { type: String, maxlength: 200 },
    location_de: { type: String, maxlength: 200 },
    details: { type: String, maxlength: 2000 },
    details_de: { type: String, maxlength: 2000 },
    description2: { type: String, maxlength: 2000 },
    description2_de: { type: String, maxlength: 2000 },
    daysAndDurations: { type: String, maxlength: 1000 },
    daysAndDurations_de: { type: String, maxlength: 1000 },
    pickup: { type: String, maxlength: 500 },
    pickup_de: { type: String, maxlength: 500 },
    briefing: { type: String, maxlength: 1000 },
    briefing_de: { type: String, maxlength: 1000 },
    trip: { type: String, maxlength: 2000 },
    trip_de: { type: String, maxlength: 2000 },
    program: { type: String, maxlength: 2000 },
    program_de: { type: String, maxlength: 2000 },
    foodAndBeverages: { type: String, maxlength: 1000 },
    foodAndBeverages_de: { type: String, maxlength: 1000 },
    whatToTake: { type: String, maxlength: 1000 },
    whatToTake_de: { type: String, maxlength: 1000 },
    pickupLocation: { type: String, maxlength: 500 },
    pickupLocation_de: { type: String, maxlength: 500 },
    vanLocation: { type: String, maxlength: 500 },
    vanLocation_de: { type: String, maxlength: 500 },

    // Location Markers
    location1: { type: String, maxlength: 200 },
    location1_de: { type: String, maxlength: 200 },
    location2: { type: String, maxlength: 200 },
    location2_de: { type: String, maxlength: 200 },
    location3: { type: String, maxlength: 200 },
    location3_de: { type: String, maxlength: 200 },
    location4: { type: String, maxlength: 200 },
    location4_de: { type: String, maxlength: 200 },
    location5: { type: String, maxlength: 200 },
    location5_de: { type: String, maxlength: 200 },
    location6: { type: String, maxlength: 200 },
    location6_de: { type: String, maxlength: 200 },

    // Images
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },

    // Status & Metadata
    slug: { type: String, required: true, unique: true, index: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    onSale: { type: Boolean, default: false },
    discount: { type: Number, min: 0, max: 100, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
TourSchema.index({ category: 1, isActive: 1 });
TourSchema.index({ onSale: 1, isActive: 1 });
TourSchema.index({ title: 'text', description: 'text', category: 'text' });

// Virtual for discounted price
TourSchema.virtual('discountedPrice').get(function () {
  if (this.onSale && this.discount > 0) {
    return Math.round(this.price - (this.price * this.discount) / 100);
  }
  return this.price;
});

export const Tour: Model<ITour> = mongoose.models.Tour || mongoose.model<ITour>('Tour', TourSchema);
