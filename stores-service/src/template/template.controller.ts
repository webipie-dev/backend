import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template } from './interfaces/template.interface';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import {createEvalAwarePartialHost} from "ts-node/dist/repl";

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get('')
  async getAllTemplates(): Promise<Template[]> {
    return await this.templateService.getAllTemplates();
  }

  @Get('/:id')
  async getOneTemplate(@Param('id') id): Promise<Template> {
    return await this.templateService.getOneTemplate(id);
  }

  @Post('')
  addOneTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<Template> {
    return this.templateService.addOneTemplate(createTemplateDto);
  }

  @Patch('/:id')
  editOneTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): string {
    return `--id: ${id} - updates: ${updateTemplateDto}`;
  }

  @Delete('/delete')
  async deleteAllTemplates(): Promise<Record<string, unknown>> {
    return await this.templateService.deleteAllTemplates();
  }
}
