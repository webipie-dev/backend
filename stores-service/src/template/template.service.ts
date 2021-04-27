import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './interfaces/template.interface';
import { CreateTemplateDto } from './dto/create-template.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel('Template')
    private readonly templateModel: SoftDeleteModel<Template>,
  ) {}

  async getAllTemplates(): Promise<Template[]> {
    return this.templateModel.find();
  }

  async getOneTemplate(id: string): Promise<Template> {
    return this.templateModel.findById(id);
  }

  async addOneTemplate(templateDTO: CreateTemplateDto): Promise<Template> {
    const template = await new this.templateModel(templateDTO);
    return template.save();
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

  async getDeletedTemplates(): Promise<Template[]> {
    return this.templateModel.findDeleted();
  }
}
