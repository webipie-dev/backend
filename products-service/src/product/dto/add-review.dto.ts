import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { isRequired } from '@webipie/common';

export class AddReviewDto {
  @IsString()
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  name: string;

  @IsOptional()
  @IsEmail()
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  review: string;

  @IsString()
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  rating: string;

  @IsOptional()
  date: number;
}
