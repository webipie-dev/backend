import { Matches } from 'class-validator';
import { isNotUrl } from '../error/error-messages';

export class UrlParam {
  @Matches(/.*\.webipie\.com$/, {
    message: isNotUrl,
  })
  url: string;
}
