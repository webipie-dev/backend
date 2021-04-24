import * as mongoose from 'mongoose';

export const StoreSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    templateId: String,
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
