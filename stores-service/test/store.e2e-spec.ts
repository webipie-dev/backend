import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../src/mongoose-mock';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from '../src/store/schemas/store.schema';
import { StoreService } from '../src/store/store.service';
import { StoreController } from '../src/store/store.controller';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Store } from '../src/store/interfaces/store.interface';
import { TemplateSchema as EmbeddedTemplateSchema } from '../src/store/schemas/template.schema';
import { TemplateService } from '../src/template/template.service';
import * as mongoose from 'mongoose';
import { TemplateController } from '../src/template/template.controller';
import { TemplateSchema } from '../src/template/schemas/template.schema';

describe('Store Controller (e2e)', () => {
  let app: INestApplication;
  let storeModel: SoftDeleteModel<Store>;
  const erroneousCreateStoreDto = {
    name: 'test store',
    template: 'abc',
  };
  const createStoreDto = {
    name: 'test store',
    type: 'clothes',
    template: 'abc',
  };
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
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Store', schema: StoreSchema },
          { name: 'Template', schema: EmbeddedTemplateSchema },
        ]),
      ],
      providers: [StoreService, TemplateService],
      controllers: [StoreController, TemplateController],
    }).compile();
    storeModel = module.get<SoftDeleteModel<Store>>('StoreModel');
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/store (POST), should throw 400 when provided with erroneous dto', async () => {
    const { text: ErrorMessages, status } = await request(app.getHttpServer())
      .post('/store')
      .send(erroneousCreateStoreDto);
    expect(JSON.parse(ErrorMessages).message).toEqual([
      'type is required',
      'template should be a Mongo ID',
    ]);
    expect(status).toEqual(400);
  });

  it('/store (POST), should throw 404 when provided with correct dto but non existent template id', async () => {
    createStoreDto.template = await mongoose.Types.ObjectId().toHexString();
    const { text: notFoundError, status } = await request(app.getHttpServer())
      .post('/store')
      .send(createStoreDto);
    expect(status).toEqual(404);
    expect(JSON.parse(notFoundError).message).toEqual('Template Not Found');
  });

  it('/store (POST), should return 201 and create a store', async () => {
    const { text: template } = await request(app.getHttpServer())
      .post('/template')
      .send(createTemplateDto);
    createStoreDto.template = JSON.parse(template).id;
    const { text: store, status } = await request(app.getHttpServer())
      .post('/store')
      .send(createStoreDto);
    expect(status).toEqual(201);
    expect(JSON.parse(store).name).toEqual(createStoreDto.name);
  });

  it('/store/:id (GET), should throw 400 when provided with an erroneous id', async () => {
    const response = await request(app.getHttpServer()).get('/store/wrongid');
    expect(response.status).toEqual(400);
    expect(JSON.parse(response.text).message).toEqual([
      'id should be a Mongo ID',
    ]);
  });

  it('/store/:id (PATCH), should throw 400 when provided with erroneous id', async () => {
    const { text: template } = await request(app.getHttpServer())
      .post('/template')
      .send(createTemplateDto);
    createStoreDto.template = JSON.parse(template).id;
    const { text: store } = await request(app.getHttpServer())
      .post('/store')
      .send(createStoreDto);

    const { text: wrongIdError, status: wrongIdStatus } = await request(
      app.getHttpServer(),
    )
      .patch('/store/wrongId')
      .send({});
    expect(wrongIdStatus).toEqual(400);
    expect(JSON.parse(wrongIdError).message).toEqual([
      'id should be a Mongo ID',
    ]);
  });

  afterEach(async () => {
    await storeModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
