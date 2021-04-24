export class CreateTemplateDto {
  readonly name: string;
  readonly header: {
    readonly img: string;
    readonly title: string;
    readonly description: string;
    readonly mainButton: string;
  };
  readonly colorChart: Record<string, any>;
  readonly colorChartOptions: [Record<string, any>];
  readonly font: string;
  readonly fontOptions: [string];
}
