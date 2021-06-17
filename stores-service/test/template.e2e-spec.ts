import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../src/mongoose-mock';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateSchema } from '../src/template/schemas/template.schema';
import { TemplateService } from '../src/template/template.service';
import { TemplateController } from '../src/template/template.controller';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Template } from '../src/template/interfaces/template.interface';

describe('Template Controller (e2e)', () => {
  let app: INestApplication;
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
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Template', schema: TemplateSchema },
        ]),
      ],
      providers: [TemplateService],
      controllers: [TemplateController],
    }).compile();
    templateModel = module.get<SoftDeleteModel<Template>>('TemplateModel');
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/template (POST), should create a template and return 201', async () => {
    const response = request(app.getHttpServer())
      .post('/template')
      .send(createTemplateDto);
    return response.expect(201);
  });

  it('/template (POST), should throw 400 when provided with erroneous DTO', async () => {
    let error = '';

    // send missing name dto
    const missingNameDto = {
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
    const nameResponse = await request(app.getHttpServer())
      .post('/template')
      .send(missingNameDto);
    error = JSON.parse(nameResponse.text).message;
    expect(nameResponse.status).toEqual(400);
    expect(error).toEqual(['name is required']);

    // send empty color chart options dto
    const emptyColorChartOptionsDto = {
      name: 'first template',
      font: 'montserrat',
      fontOptions: ['montserrat'],
      colorChart: { testColor: 'test' },
      colorChartOptions: [],
      header: {
        img: 'image',
        description: 'description',
        mainButton: 'button',
        title: 'title',
      },
    };
    const arrayResponse = await request(app.getHttpServer())
      .post('/template')
      .send(emptyColorChartOptionsDto);
    error = JSON.parse(arrayResponse.text).message;
    expect(arrayResponse.status).toEqual(400);
    expect(error).toEqual([
      'minimum size of 1 is required in colorChartOptions',
    ]);

    // send missing img in header dto
    const missingImgDto = {
      name: 'test template',
      font: 'montserrat',
      fontOptions: ['montserrat'],
      colorChart: { testColor: 'test' },
      colorChartOptions: [{ testColor: 'test' }],
      header: {
        description: 'description',
        mainButton: 'button',
        title: 'title',
      },
    };
    const imgResponse = await request(app.getHttpServer())
      .post('/template')
      .send(missingImgDto);
    error = JSON.parse(imgResponse.text).message;
    expect(imgResponse.status).toEqual(400);
    expect(error).toEqual(['header.img is required']);
  });

  it('/template/:id (GET), should get template by id', async () => {
    const { text } = await request(app.getHttpServer())
      .post('/template')
      .send(createTemplateDto);
    const template = await request(app.getHttpServer()).get(
      '/template/' + JSON.parse(text).id,
    );
    expect(JSON.parse(template.text)).toEqual(JSON.parse(text));
    expect(template.status).toEqual(200);
  });

  it('/template/:id (GET), should throw 400 when provided with an erroneous id', async () => {
    const response = await request(app.getHttpServer()).get(
      '/template/wrongid',
    );
    expect(response.status).toEqual(400);
    expect(JSON.parse(response.text).message).toEqual([
      'id should be a Mongo ID',
    ]);
  });

  it('/template (GET), should get all available templates', async () => {
    await request(app.getHttpServer())
      .post('/template')
      .send(createTemplateDto);
    const template = await request(app.getHttpServer()).get('/template');
    expect(template.status).toEqual(200);
  });

  it('/template/:id (PATCH), should edit a product', async () => {
    const { text: template } = await request(app.getHttpServer())
      .post('/template')
      .send(createTemplateDto);

    const { text: updatedTemplate, status } = await request(app.getHttpServer())
      .patch('/template/' + JSON.parse(template).id)
      .send({ name: 'new name' });

    expect(JSON.parse(updatedTemplate).name).toEqual('new name');
    expect(status).toEqual(200);
  });

  it('/template/:id (PATCH), should throw 400 when provided with erroneous id or dto', async () => {
    const { text: template } = await request(app.getHttpServer())
      .post('/template')
      .send(createTemplateDto);

    const { text: emptyArrayError, status: emptyArrayStatus } = await request(
      app.getHttpServer(),
    )
      .patch('/template/' + JSON.parse(template).id)
      .send({ colorChartOptions: [] });
    expect(emptyArrayStatus).toEqual(400);
    expect(JSON.parse(emptyArrayError).message).toEqual([
      'minimum size of 1 is required in colorChartOptions',
    ]);

    const { text: wrongIdError, status: wrongIdStatus } = await request(
      app.getHttpServer(),
    )
      .patch('/template/wrongId')
      .send({});
    expect(wrongIdStatus).toEqual(400);
    expect(JSON.parse(wrongIdError).message).toEqual([
      'id should be a Mongo ID',
    ]);
  });

  afterEach(async () => {
    await templateModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
