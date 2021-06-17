import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { isNotArray, isRequired } from '@webipie/common';

export class EditProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsArray({
    message: (validationData: ValidationArguments) =>
      isNotArray(validationData.property),
  })
  imgs?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  status?: string;

  @IsOptional()
  @IsBoolean()
  popular?: boolean;

  @IsOptional()
  @IsBoolean()
  openReview?: boolean;

  @IsOptional()
  @IsArray({
    message: (validationData: ValidationArguments) =>
      isNotArray(validationData.property),
  })
  deletedImages?: string[];
}
