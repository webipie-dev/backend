import { Matches } from 'class-validator';
import { isNotUrl } from '@webipie/common';

export class UrlParam {
  @Matches(/.*\.webipie\.com$/, {
    message: isNotUrl,
  })
  url: string;
}
