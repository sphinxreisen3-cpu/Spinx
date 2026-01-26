import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  country?: string;
  role?: string;
  role_de?: string;
  initials: string;
  image: string;
  text: string;
  text_de?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, maxlength: 100 },
    country: { type: String, maxlength: 100 },
    role: { type: String, maxlength: 100 },
    role_de: { type: String, maxlength: 100 },
    initials: { type: String, required: true, maxlength: 3 },
    image: { type: String, required: true, default: 'blue' },
    text: { type: String, required: true, minlength: 10, maxlength: 2000 },
    text_de: { type: String, maxlength: 2000 },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TestimonialSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 });

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
