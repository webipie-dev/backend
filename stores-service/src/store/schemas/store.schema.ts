import * as mongoose from 'mongoose';

export const StoreSchema = new mongoose.Schema({
  name: String,
  type: String,
  templateId: String,
});
