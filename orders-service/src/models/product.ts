import * as mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Model } from "mongoose";

//Properties required to create a new product
interface ProductAttrs {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  storeId: string;
}

//Interface that describes the properties that a ticket document (saved record) has
interface ProductDoc extends mongoose.Document {
  name: string;
  price: number;
  stock: number;
  image: string;
  storeId: string;
  version: number;
  // add isOutOfStck metjod
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);
productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);

export { ProductDoc, productSchema as ProductSchema };
