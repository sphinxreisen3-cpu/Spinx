import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  name: string;
  email: string;
  reviewText: string;
  rating: number;
  tourId: mongoose.Types.ObjectId;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true },
    reviewText: { type: String, required: true, minlength: 10, maxlength: 1000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    tourId: { type: Schema.Types.ObjectId, ref: 'Tour', required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ tourId: 1, isApproved: 1 });
ReviewSchema.index({ email: 1, tourId: 1 }, { unique: true });

export const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
