import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
import { isNotArray, minSizeRequired } from '@webipie/common';

export class TemplateDto {
  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly header: {
    readonly img: string;
    readonly title: string;
    readonly description: string;
    readonly mainButton: string;
  };

  @IsOptional()
  readonly colorChart: Record<string, any>;

  @IsOptional()
  @IsArray({
    message: (validationData: ValidationArguments) =>
      isNotArray(validationData.property),
  })
  @ArrayMinSize(1, {
    message: (validationData: ValidationArguments) =>
      minSizeRequired(validationData.property),
  })
  readonly colorChartOptions: Record<string, any>[];

  @IsOptional()
  readonly font: string;

  @IsOptional()
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
