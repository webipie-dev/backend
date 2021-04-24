import * as mongoose from 'mongoose';
import { Template } from '../interfaces/template.interface';
import { CreateTemplateDto } from '../dto/create-template.dto';

/**
 * TemplateSchema schema
 * @constructor Template
 */
export const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    header: {
      img: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      mainButton: { type: String, required: true },
    },
    colorChart: { type: {}, required: true },
    colorChartOptions: { type: [{}], required: true },
    font: { type: String, required: true },
    fontOptions: { type: [String], required: true },
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
