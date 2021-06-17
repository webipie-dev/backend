import { Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  description: string;
  imgs: string[];
  price: number;
  quantity: number;
  status: string;
  popular: boolean;
  openReview: boolean;
  reviews: Review[];
  store: string;
  deletedAt: Date;
  isDeleted: boolean;
}

class Review {
  name: string;
  email: string;
  review: string;
  rating: string;
  date: Date;
}
