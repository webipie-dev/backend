import { Document } from 'mongoose';
import { Template } from '../../template/interfaces/template.interface';

export interface Store extends Document {
  name: string;
  type: string;
  url: string;
  logo: string;
  about: string;
  storeType: string;
  contact: Contact;
  template: Template;
}

class Contact {
  phoneNumber: string;
  email: string;
  facebookPage: string;
  instagramPage: string;
  location: string;
}
