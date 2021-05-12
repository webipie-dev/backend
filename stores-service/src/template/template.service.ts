import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './interfaces/template.interface';
import { CreateTemplateDto } from './dto/create-template.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel('Template')
    private readonly templateModel: SoftDeleteModel<Template>,
  ) {}

  async getAllTemplates(filters: Record<string, unknown>): Promise<Template[]> {
    return this.templateModel.find(filters);
  }

  async getOneTemplate(id: string): Promise<Template> {
    return this.templateModel.findById(id);
  }

  async getDeletedTemplates(): Promise<Template[]> {
    return this.templateModel.findDeleted();
  }

  async addOneTemplate(templateDTO: CreateTemplateDto): Promise<Template> {
    const template = await new this.templateModel(templateDTO);
    return template.save();
  }

  async editOneTemplate(
    id: string,
    templateDTO: UpdateTemplateDto,
  ): Promise<Template> {
    const template = await this.templateModel.findById(id);
    if (!template) {
      throw new NotFoundException('Template Not Found');
    }
    return this.templateModel.findByIdAndUpdate(id, templateDTO, { new: true });
  }

  test(): string {
    return 'hello';
  }

  async deleteAllTemplates(): Promise<Record<string, unknown>> {
    return this.templateModel.deleteMany();
  }

  async deleteTemplateById(id: string): Promise<Template> {
    return this.templateModel.findByIdAndDelete(id);
  }

  async softDeleteTemplateById(id: string): Promise<Template> {
    return this.templateModel.softDelete(id);
  }

  async restoreTemplateById(id: string): Promise<Template> {
    return this.templateModel.restore(id);
  }
}
