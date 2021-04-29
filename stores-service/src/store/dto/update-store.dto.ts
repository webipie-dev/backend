import { Template } from '../../template/interfaces/template.interface';

export class UpdateStoreDto {
  readonly name: string;
  readonly type: string;
  readonly logo: string;
  readonly about: string;
  readonly storeType: string;
  readonly contact: Contact;
  readonly template: Template;
}

class Contact {
  readonly phoneNumber: string;
  readonly email: string;
  readonly facebookPage: string;
  readonly instagramPage: string;
  readonly location: string;
}
