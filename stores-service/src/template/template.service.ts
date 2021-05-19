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
    return await this.templateModel.find(filters).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async getOneTemplate(id: string): Promise<Template> {
    return await this.templateModel.findById(id).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async getDeletedTemplates(): Promise<Template[]> {
    let deletedTemplates: Template[];
    try {
      deletedTemplates = await this.templateModel.findDeleted();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return deletedTemplates;
  }

  async addOneTemplate(templateDTO: CreateTemplateDto): Promise<Template> {
    const template = await new this.templateModel(templateDTO);
    return await template.save().catch((error) => {
      throw new InternalServerErrorException({ message: error.message });
    });
  }

  async editOneTemplate(
    id: string,
    templateDTO: UpdateTemplateDto,
  ): Promise<Template> {
    const template = await this.templateModel.findById(id);
    if (!template) {
      throw new NotFoundException('Template Not Found');
    }
    return await this.templateModel
      .findByIdAndUpdate(id, templateDTO, { new: true })
      .catch((error) => {
        throw new InternalServerErrorException(error.message);
      });
  }

  async deleteFilteredTemplates(
    filters?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return await this.templateModel.deleteMany(filters).catch((error) => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async deleteTemplateById(id: string): Promise<Template> {
    return await this.templateModel.findByIdAndDelete(id).catch((error) => {
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
