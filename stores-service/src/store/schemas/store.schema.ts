import * as mongoose from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { TemplateSchema } from '../../template/schemas/template.schema';

const ContactSchema = new mongoose.Schema({
  phoneNumber: { type: String },
  email: { type: String },
  facebookPage: { type: String },
  instagramPage: { type: String },
  location: { type: String },
});

const StoreSchema = new mongoose.Schema(
  {
    name: { type: String },
    type: { type: String },
    url: { type: String, required: true, unique: true },
    logo: { type: String },
    about: {
      type: String,
      default:
        'Our Store provides high quality products with affordable prices.\n' +
        ' Contact us on Facebook or Instagram for more information',
    },
    storeType: { type: String },
    creationDate: { type: Date, default: Date.now() },
    contact: ContactSchema,
    template: TemplateSchema,
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
