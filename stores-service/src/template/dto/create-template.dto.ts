import {
  ArrayMinSize,
  IsArray,
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
  readonly header: {
    readonly img: string;
    readonly title: string;
    readonly description: string;
    readonly mainButton: string;
  };

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
  @ValidateNested({
    each: true,
    message: (validationData: ValidationArguments) =>
      nestedElementsRequired(validationData.property),
  })
  @ArrayMinSize(1, {
    message: (validationData: ValidationArguments) =>
      minSizeRequired(validationData.property),
  })
  readonly colorChartOptions: [Record<string, any>];

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
  @ValidateNested({
    each: true,
    message: (validationData: ValidationArguments) =>
      nestedElementsRequired(validationData.property),
  })
  @ArrayMinSize(1, {
    message: (validationData: ValidationArguments) =>
      minSizeRequired(validationData.property),
  })
  readonly fontOptions: [string];
}
