import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../mongoose-mock';
import { TemplateSchema } from './schemas/template.schema';
import { InternalServerErrorException } from '@nestjs/common';
import { Template } from './interfaces/template.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import * as mongoose from 'mongoose';

describe('TemplateService', () => {
  let service: TemplateService;
  let module: TestingModule;
  let templateModel: SoftDeleteModel<Template>;
  const createTemplateDto = {
    name: 'test template',
    font: 'montserrat',
    fontOptions: ['montserrat'],
    colorChart: { testColor: 'test' },
    colorChartOptions: [{ testColor: 'test' }],
    header: {
      img: 'image',
      description: 'description',
      mainButton: 'button',
      title: 'title',
    },
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Template', schema: TemplateSchema },
        ]),
      ],
      providers: [TemplateService],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
    templateModel = module.get<SoftDeleteModel<Template>>('TemplateModel');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch only available templates', async () => {
    const template = await service.addOneTemplate(createTemplateDto);
    const createTemplateDto2 = {
      name: 'test template 2',
      font: 'montserrat',
      fontOptions: ['montserrat'],
      colorChart: { testColor: 'test' },
      colorChartOptions: [{ testColor: 'test' }],
      header: {
        img: 'image',
        description: 'description',
        mainButton: 'button',
        title: 'title',
      },
    };
    await service.addOneTemplate(createTemplateDto2);
    await service.softDeleteTemplateById(template.id);
    const availableTemplates = await service.getFilteredTemplates();
    expect(availableTemplates).toBeDefined();
    expect(availableTemplates).toHaveLength(1);
  });

  it('should fetch a template if exists, null if not', async () => {
    const returnedTemplate = await service.addOneTemplate(createTemplateDto);
    expect(await service.getOneTemplate(returnedTemplate.id)).toBeDefined();
    const id = new mongoose.Types.ObjectId().toHexString();
    expect(await service.getOneTemplate(id)).toBeNull();
  });

  it('should fetch all soft deleted templates', async () => {
    const template = await service.addOneTemplate(createTemplateDto);
    await service.softDeleteTemplateById(template.id);
    const deletedTemplates = await service.getDeletedTemplates();
    expect(deletedTemplates).toBeDefined();
    expect(deletedTemplates).toHaveLength(1);
  });

  it('should create new template', async () => {
    const templateReturned = await service.addOneTemplate(createTemplateDto);
    expect(templateReturned.name).toEqual(createTemplateDto.name);
    expect(templateReturned.isDeleted).toEqual(false);
    expect(templateReturned.deletedAt).toEqual(null);
  });

  it('should throw an error when creating new template with erroneous dto, duplicate name', async () => {
    await service.addOneTemplate(createTemplateDto);
    try {
      await service.addOneTemplate(createTemplateDto);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('should update a template', async () => {
    const templateReturned = await service.addOneTemplate(createTemplateDto);
    const updatedTemplate = await service.editOneTemplate(templateReturned.id, {
      name: 'new name',
    });
    expect(updatedTemplate.name).toEqual('new name');
  });

  it('should throw an error when updating new template with erroneous dto, duplicate name', async () => {
    const returnedTemplate = await service.addOneTemplate(createTemplateDto);
    try {
      await service.editOneTemplate(returnedTemplate.id, createTemplateDto);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it("should delete a template by id and return null if template doesn't exist", async () => {
    const template = await service.addOneTemplate(createTemplateDto);
    expect((await service.deleteTemplateById(template.id)).id).toEqual(
      template.id,
    );
    const id = new mongoose.Types.ObjectId().toHexString();
    expect(await service.deleteTemplateById(id)).toBeNull();
  });

  it('should soft delete a template by id', async () => {
    const template = await service.addOneTemplate(createTemplateDto);
    const softDeletedTemplate = await service.softDeleteTemplateById(
      template.id,
    );
    expect(softDeletedTemplate.isDeleted).toEqual(true);
    expect(softDeletedTemplate.deletedAt).not.toEqual(null);
  });

  it('should throw an error when soft deleting a non existing template', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    try {
      await service.softDeleteTemplateById(id);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('should restore a soft deleted template', async () => {
    const template = await service.addOneTemplate(createTemplateDto);
    await service.softDeleteTemplateById(template.id);
    const restoredTemplate = await service.restoreTemplateById(template.id);
    expect(restoredTemplate.id).toEqual(template.id);
    expect(restoredTemplate.isDeleted).toEqual(false);
    expect(restoredTemplate.deletedAt).toBeNull();
  });

  it('should throw an error when restoring a non existing template', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    try {
      await service.restoreTemplateById(id);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  afterEach(async () => {
    await templateModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
