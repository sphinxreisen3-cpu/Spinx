// Type definitions for reviews
export interface Review {
  _id: string;
  name: string;
  email: string;
  reviewText: string;
  rating: number;
  tourId: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewInput {
  name: string;
  email: string;
  reviewText: string;
  rating: number;
  tourId: string;
}

export interface UpdateReviewInput {
  isApproved?: boolean;
  reviewText?: string;
  rating?: number;
}
