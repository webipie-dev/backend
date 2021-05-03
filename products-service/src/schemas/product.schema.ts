import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import * as mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  review: { type: String, default: '' },
  rating: { type: String, default: '' },
  date: { type: Date, default: Date.now() },
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, default: '' },
    description: { type: String, required: false, default: '' },
    imgs: { type: [String], required: false, default: '' },
    price: { type: Number, required: false, default: 0 },
    quantity: { type: Number, required: false, default: 0, min: 0 },
    status: { type: String, required: false, default: 'disponible' },
    popular: { type: Boolean, required: false, default: false },
    openReview: { type: Boolean, required: false, default: true },
    reviews: [reviewSchema],
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', default: '' },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

ProductSchema.plugin(softDeletePlugin);

export { ProductSchema };
