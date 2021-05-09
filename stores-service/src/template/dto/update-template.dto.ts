import { IsOptional } from 'class-validator';

export class UpdateTemplateDto {
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
  readonly colorChartOptions: [Record<string, any>];

  @IsOptional()
  readonly font: string;

  @IsOptional()
  readonly fontOptions: [string];
}
