import { IsMongoId, IsNotEmpty, ValidationArguments } from 'class-validator';
import { isRequired, isNotMongoId } from '@webipie/common';

export class CreateStoreDto {
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  readonly name: string;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  readonly type: string;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  @IsMongoId({
    message: (validationData: ValidationArguments) =>
      isNotMongoId(validationData.property),
  })
  template: string;
}
