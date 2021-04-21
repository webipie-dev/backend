import { Document } from 'mongoose';

export interface Store extends Document {
  id?: string;
  name: string;
  type: string;
  templateId: string;
}
