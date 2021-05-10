import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async getFilteredTemplates(
    filters?: Record<string, unknown>,
  ): Promise<Template[]> {
    return this.templateModel.find(filters);
  }

  async getOneTemplate(id: string): Promise<Template> {
    return await this.templateModel.findById(id).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async getDeletedTemplates(): Promise<Template[]> {
    return this.templateModel.findDeleted();
  }

  async addOneTemplate(templateDTO: CreateTemplateDto): Promise<Template> {
    const template = await new this.templateModel(templateDTO);
    await template.save().catch((error) => {
      throw new InternalServerErrorException({ message: error.message });
    });
    return template;
  }

  async editOneTemplate(
    id: string,
    templateDTO: UpdateTemplateDto,
  ): Promise<Template> {
    const template = await this.templateModel.findById(id);
    if (!template) {
      throw new NotFoundException('Template Not Found');
    }
    return this.templateModel
      .findByIdAndUpdate(id, templateDTO, { new: true })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  async deleteFilteredTemplates(
    filters?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.templateModel.deleteMany(filters).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async deleteTemplateById(id: string): Promise<Template> {
    return this.templateModel.findByIdAndDelete(id).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async softDeleteTemplateById(id: string): Promise<Template> {
    let template: Template;
    try {
      template = await this.templateModel.softDelete(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return template;
  }

  async restoreTemplateById(id: string): Promise<Template> {
    let template: Template;
    try {
      template = await this.templateModel.restore(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return template;
  }
}
