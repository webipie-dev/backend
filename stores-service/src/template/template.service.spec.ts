import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Template } from './interfaces/template.interface';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../mongoose-mock';
import { TemplateSchema } from './schemas/template.schema';

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Template', schema: TemplateSchema },
        ]),
      ],
      providers: [TemplateService],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch a template', async () => {
    const template = await service.getOneTemplate('6086954fd6457d41745ed752');
    expect(template).toBeNull();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
