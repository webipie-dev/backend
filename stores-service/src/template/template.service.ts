import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Template } from './interfaces/template.interface';
import { CreateTemplateDto } from './dto/create-template.dto';
import { Model } from 'mongoose';

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel('Template') private readonly templateModel: Model<Template>,
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
}
