import { IsMongoId, ValidationArguments } from 'class-validator';
import { isNotMongoId } from '../error/error-messages';

export class IdParam {
  @IsMongoId({
    message: (validationData: ValidationArguments) =>
      isNotMongoId(validationData.property),
  })
  id: string;
}
