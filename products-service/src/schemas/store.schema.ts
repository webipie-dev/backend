import * as mongoose from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

const StoreSchema = new mongoose.Schema(
  {
    name: { type: String },
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

StoreSchema.plugin(softDeletePlugin);

export { StoreSchema };
