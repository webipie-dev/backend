import * as mongoose from "mongoose";
import { Model } from "mongoose";

interface StoreAttrs {
  id: string
}

interface StoreDoc extends mongoose.Document{
  id: string;
}

const storeSchema = new mongoose.Schema({}, {
  toJSON: {
    transform(doc, ret){
      ret._id = ret.id;
      delete ret._id;
    }
  }
});

export { StoreDoc, storeSchema as StoreSchema };
