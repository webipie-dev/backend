import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template } from './interfaces/template.interface';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}
  @Get('')
  async getAllTemplates(@Query() query): Promise<Template[]> {
    return await this.templateService.getAllTemplates(query);
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
  async editOneTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template> {
    return await this.templateService.editOneTemplate(id, updateTemplateDto);
  }

  @Delete('/delete')
  async deleteAllTemplates(): Promise<Record<string, unknown>> {
    return await this.templateService.deleteAllTemplates();
  }

  @Delete('/delete/:id')
  async deleteTemplateById(@Param('id') id: string): Promise<Template> {
    return await this.templateService.deleteTemplateById(id);
  }

  @Delete('/:id')
  async softDeleteTemplateById(@Param('id') id: string): Promise<Template> {
    return await this.templateService.softDeleteTemplateById(id);
  }

  @Get('/restore/:id')
  async restoreById(@Param('id') id: string): Promise<Template> {
    return await this.templateService.restoreTemplateById(id);
  }

  @Get('deleted/all')
  async getDeletedTemplates(): Promise<Template[]> {
    return await this.templateService.getDeletedTemplates();
  }
}
