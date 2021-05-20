import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { isRequired, isNotMongoId, isNotArray } from '@webipie/common';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  readonly name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  quantity: number;

  @IsArray({
    message: (validationData: ValidationArguments) =>
      isNotArray(validationData.property),
  })
  imgs: string[];

  @IsString()
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  status: string;

  @IsBoolean()
  popular: boolean;

  @IsBoolean()
  openReview: boolean;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  @IsMongoId({
    message: (validationData: ValidationArguments) =>
      isNotMongoId(validationData.property),
  })
  storeId: string;
}
