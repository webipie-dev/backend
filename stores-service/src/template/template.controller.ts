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
import { IdParam } from '@webipie/common';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get('')
  async getAllTemplates(@Query() query?): Promise<Template[]> {
    return await this.templateService.getAllTemplates(query);
  }

  @Get('/:id')
  async getOneTemplate(@Param() param: IdParam): Promise<Template> {
    return await this.templateService.getOneTemplate(param.id);
  }

  @Get('deleted/all')
  async getDeletedTemplates(): Promise<Template[]> {
    return await this.templateService.getDeletedTemplates();
  }

  @Post('')
  addOneTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
  ): Promise<Template> {
    return this.templateService.addOneTemplate(createTemplateDto);
  }

  @Patch('/:id')
  async editOneTemplate(
    @Param() param: IdParam,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template> {
    return await this.templateService.editOneTemplate(
      param.id,
      updateTemplateDto,
    );
  }

  @Delete('/delete')
  async deleteAllTemplates(@Query() query?): Promise<Record<string, unknown>> {
    return await this.templateService.deleteAllTemplates(query);
  }

  @Delete('/delete/:id')
  async deleteTemplateById(@Param() param: IdParam): Promise<Template> {
    return await this.templateService.deleteTemplateById(param.id);
  }

  @Delete('/:id')
  async softDeleteTemplateById(@Param() param: IdParam): Promise<Template> {
    return await this.templateService.softDeleteTemplateById(param.id);
  }

  @Get('/restore/:id')
  async restoreTemplateById(@Param() param: IdParam): Promise<Template> {
    return await this.templateService.restoreTemplateById(param.id);
  }
}
