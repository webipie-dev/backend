import { TemplateDto } from './template.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTemplateDto extends PartialType(TemplateDto) {}
