import { Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  description: string;
  imgs: Array<string>;
  price: number;
  quantity: number;
  status: string;
  popular: boolean;
  openReview: boolean;
  reviews: [Review];
  store: string;
}

class Review {
  name: string;
  email: string;
  review: string;
  rating: string;
  date: Date;
}
