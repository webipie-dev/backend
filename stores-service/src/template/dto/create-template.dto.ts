import {
  ArrayMinSize,
  IsArray,
  isNotEmpty,
  IsNotEmpty,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import {
  isNotArray,
  isRequired,
  minSizeRequired,
  nestedElementsRequired,
} from '@webipie/common';
import {Type} from "class-transformer";

class Header {
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
        isRequired(validationData.property),
  })
  readonly img: string;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
        isRequired(validationData.property),
  })
  readonly title: string;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
        isRequired(validationData.property),
  })
  readonly description: string;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
        isRequired(validationData.property),
  })
  readonly mainButton: string;
}

export class CreateTemplateDto {
  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  readonly name: string;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  @ValidateNested({
    each: true,
    message: (validationData: ValidationArguments) =>
      nestedElementsRequired(validationData.property),
  })
  @Type(() => Header)
  readonly header: Header;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  readonly colorChart: Record<string, any>;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  @IsArray({
    message: (validationData: ValidationArguments) =>
      isNotArray(validationData.property),
  })
  @ArrayMinSize(1, {
    message: (validationData: ValidationArguments) =>
      minSizeRequired(validationData.property),
  })
  readonly colorChartOptions: Record<string, any>[];

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  readonly font: string;

  @IsNotEmpty({
    message: (validationData: ValidationArguments) =>
      isRequired(validationData.property),
  })
  @IsArray({
    message: (validationData: ValidationArguments) =>
      isNotArray(validationData.property),
  })
  @ArrayMinSize(1, {
    message: (validationData: ValidationArguments) =>
      minSizeRequired(validationData.property),
  })
  readonly fontOptions: string[];
}
