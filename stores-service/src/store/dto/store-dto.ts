import { Template } from '../../template/interfaces/template.interface';
import { IsOptional } from 'class-validator';

class Contact {
  readonly phoneNumber: string;
  readonly email: string;
  readonly facebookPage: string;
  readonly instagramPage: string;
  readonly location: string;
}

export class StoreDto {
  @IsOptional()
  readonly name: string;
  @IsOptional()
  readonly type: string;
  @IsOptional()
  readonly logo: string;
  @IsOptional()
  readonly about: string;
  @IsOptional()
  readonly contact: Contact;
  @IsOptional()
  readonly template: Template;
}
