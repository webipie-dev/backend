import * as mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Model } from "mongoose";

//Properties required to create a new product
interface ProductAttrs {
  id: string;
  name: string;
  price: number;
  orderedQuantity: number;
  stock: number;
  image: string;
  storeId: string;
}

//Interface that describes the properties that a ticket document (saved record) has
interface ProductDoc extends mongoose.Document {
  name: string;
  price: number;
  orderedQuantity: number;
  stock: number;
  image: string;
  storeId: string;
  version: number;
}

//Interface describing the properties that a ticket model has
interface ProductModel extends Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
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
    orderedQuantity: {
      type: Number,
      required: true,
      min: 1,
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

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    name: attrs.name,
    price: attrs.price,
    orderedQuantity: attrs.orderedQuantity,
    image: attrs.image,
    storeId: attrs.storeId,
  });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  'Product',
  productSchema,
);

export { ProductModel, productSchema as ProductSchema };
