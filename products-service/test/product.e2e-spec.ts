import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../stores-service/src/mongoose-mock';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Store } from '../src/interfaces/store.interface';
import { Product } from '../src/interfaces/product.interface';
import { ProductSchema } from '../src/schemas/product.schema';
import { StoreSchema } from '../src/schemas/store.schema';
import { StoreService } from '../src/store/store.service';
import { StoreController } from '../src/store/store.controller';
import { ProductService } from '../src/product/product.service';
import { ProductController } from '../src/product/product.controller';

describe('Store Controller (e2e)', () => {
  let app: INestApplication;
  let storeModel: SoftDeleteModel<Store>;
  let productModel: SoftDeleteModel<Product>;

  const erroneousCreateProductDto = {
    name: 'test prod',
    storeId: mongoose.Types.ObjectId().toHexString(),
  };
  const createProductDto = {
    storeId: mongoose.Types.ObjectId().toHexString(),
    name: 'ooooo',
    description: 'awel product',
    price: 40,
    quantity: 10,
    imgs: ['iamge', 'image'],
    status: 'disponible',
    popular: true,
    openReview: true,
  };
  const createStoreDto = {
    name: 'test store',
  };

  const createNewStore = async () => {
    const { body: store } = await request(app.getHttpServer())
      .post('/store')
      .send();

    return store;
  };

  const createNewProduct = async () => {
    const { body: product } = await request(app.getHttpServer())
      .post('/product')
      .send(createProductDto);

    return product;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'Store', schema: StoreSchema },
          { name: 'Product', schema: ProductSchema },
        ]),
      ],
      providers: [StoreService, ProductService],
      controllers: [StoreController, ProductController],
    }).compile();
    productModel = module.get<SoftDeleteModel<Product>>('ProductModel');
    storeModel = module.get<SoftDeleteModel<Store>>('StoreModel');
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  /**
   * @method POST
   * @path /product
   */
  it('should throw 400 when provided with erroneous dto', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/product')
      .send(erroneousCreateProductDto);
    expect(status).toEqual(400);
  });

  /**
   * @method POST
   * @path /product
   */
  it('should throw 404 when provided with correct dto but non existent store id', async () => {
    const { text: notFoundError, status } = await request(app.getHttpServer())
      .post('/product')
      .send(createProductDto);
    expect(status).toEqual(404);
    expect(JSON.parse(notFoundError).message).toEqual('Store Not Found');
  });

  /**
   * @method POST
   * @path /product
   */
  it('should return 201 and create a store', async () => {
    const store = await createNewStore();
    createProductDto.storeId = store._id;
    const { body: product, status } = await request(app.getHttpServer())
      .post('/product')
      .send(createProductDto);
    expect(status).toEqual(201);
    expect(product.name).toEqual(createProductDto.name);
  });

  /**
   * @method GET
   * @path /product/:id
   */
  it('should throw 400 when provided with an erroneous id', async () => {
    const response = await request(app.getHttpServer()).get('/product/wrongid');
    expect(response.status).toEqual(400);
    expect(JSON.parse(response.text).message).toEqual([
      'id should be a Mongo ID',
    ]);
  });

  /**
   * @method PATCH
   * @path /product/:id
   */
  it('should throw 400 when provided with erroneous id', async () => {
    // const newStore = await createNewStore();
    //
    // createProductDto.storeId = newStore._id;
    // await createNewProduct();

    const { text: wrongIdError, status: wrongIdStatus } = await request(
      app.getHttpServer(),
    )
      .patch('/product/wrongId')
      .send({});
    expect(wrongIdStatus).toEqual(400);
    expect(JSON.parse(wrongIdError).message).toEqual([
      'id should be a Mongo ID',
    ]);
  });

  /**
   * @method PATCH
   * @path /product/:id
   */
  it('should edit a product', async () => {
    const newStore = await createNewStore();

    createProductDto.storeId = newStore._id;
    const newProduct = await createNewProduct();

    const { status } = await request(app.getHttpServer())
      .patch(`/product/${newProduct._id}`)
      .send({ name: 'product 2222' });
    expect(status).toEqual(200);
  });

  /**
   * @method POST
   * @path /product/review/:id
   */
  it('should add a review', async () => {
    const newStore = await createNewStore();

    createProductDto.storeId = newStore._id;
    const newProduct = await createNewProduct();

    const { status } = await request(app.getHttpServer())
      .post(`/product/review/${newProduct._id}`)
      .send({
        name: 'khra',
        review: 'aaaaaaaaaaaaaaaaaaaaaaaaaaa',
        rating: '5',
        email: 'aaa@gmail.com',
      });
    expect(status).toEqual(201);
  });

  afterEach(async () => {
    await productModel.deleteMany({});
    await storeModel.deleteMany({});
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
