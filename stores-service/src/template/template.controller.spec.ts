import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

describe('TemplateController', () => {
  let controller: TemplateController;
  const mockTemplateService = {
    getFilteredTemplates: jest.fn((filters?: Record<string, any>) => {
      return [];
    }),
    getOneTemplate: jest.fn((id: string) => {
      return { id };
    }),
    addOneTemplate: jest.fn((dto: CreateTemplateDto) => {
      return {
        name: dto.name,
        id: 'abscdtfe',
      };
    }),
    editOneTemplate: jest.fn((id: string, dto: UpdateTemplateDto) => {
      return { id, ...dto };
    }),
    deleteFilteredTemplates: jest.fn((filters?: Record<string, any>) => {
      return {};
    }),
    deleteTemplateById: jest.fn((id: string) => {
      return {
        id,
      };
    }),
    softDeleteTemplateById: jest.fn((id: string) => {
      return {
        id,
      };
    }),
    restoreTemplateById: jest.fn((id: string) => {
      return { id };
    }),
    getDeletedTemplates: jest.fn(() => {
      return [];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [TemplateService],
    })
      .overrideProvider(TemplateService)
      .useValue(mockTemplateService)
      .compile();

    controller = module.get<TemplateController>(TemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should fetch template by id', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.getOneTemplate(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockTemplateService.getOneTemplate).toHaveBeenCalledWith(idParam.id);
  });

  it('should fetch filtered templates', async () => {
    const query = {};
    expect(await controller.getFilteredTemplates()).toEqual([]);
    expect(mockTemplateService.getFilteredTemplates).toHaveBeenCalledWith(
      undefined,
    );
    expect(await controller.getFilteredTemplates(query)).toEqual([]);
    expect(mockTemplateService.getFilteredTemplates).toHaveBeenLastCalledWith(
      query,
    );
  });

  it('should fetch deleted templates', async () => {
    expect(await controller.getDeletedTemplates()).toEqual([]);
    expect(mockTemplateService.getDeletedTemplates).toHaveBeenCalledWith();
  });

  it('should create a template', async () => {
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

    expect(await controller.addOneTemplate(createTemplateDto)).toEqual({
      id: expect.any(String),
      name: createTemplateDto.name,
    });

    expect(mockTemplateService.addOneTemplate).toHaveBeenCalledWith(
      createTemplateDto,
    );
  });

  it('should edit a template', async () => {
    const updateTemplateDto = {
      name: 'abc',
      font: 'montserrat',
      fontOptions: [],
      colorChart: {},
      colorChartOptions: [],
      header: {
        img: 'image',
        description: 'description',
        mainButton: 'button',
        title: 'title',
      },
    };
    const idParam = {
      id: 'abc',
    };
    expect(
      await controller.editOneTemplate(idParam, updateTemplateDto),
    ).toEqual({
      id: idParam.id,
      ...updateTemplateDto,
    });

    expect(mockTemplateService.editOneTemplate).toHaveBeenCalledWith(
      idParam.id,
      updateTemplateDto,
    );
  });

  it('should delete filtered templates', async () => {
    const query = {};
    expect(await controller.deleteFilteredTemplates(query)).toEqual({});
    expect(mockTemplateService.deleteFilteredTemplates).toHaveBeenCalledWith(
      query,
    );
    expect(await controller.deleteFilteredTemplates()).toEqual({});
    expect(
      mockTemplateService.deleteFilteredTemplates,
    ).toHaveBeenLastCalledWith(undefined);
  });

  it('should delete template by id', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.deleteTemplateById(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockTemplateService.deleteTemplateById).toHaveBeenCalledWith(
      idParam.id,
    );
  });

  it('should soft delete template by id', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.softDeleteTemplateById(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockTemplateService.softDeleteTemplateById).toHaveBeenCalledWith(
      idParam.id,
    );
  });

  it('should restore a soft deleted template', async () => {
    const idParam = { id: 'abc' };
    expect(await controller.restoreTemplateById(idParam)).toEqual({
      id: idParam.id,
    });
    expect(mockTemplateService.restoreTemplateById).toHaveBeenCalledWith(
      idParam.id,
    );
  });
});
