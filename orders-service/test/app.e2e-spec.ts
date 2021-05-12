import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../src/orders/orders.controller';
import { rootMongooseTestModule } from "./setup";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderDoc, OrderSchema } from "../src/models/order";
import { ProductDoc, ProductSchema } from "../src/models/product";
import { ClientDoc, ClientSchema } from "../src/models/client";
import { StoreDoc, StoreSchema } from "../src/models/store";
import { OrdersService } from "../src/orders/orders.service";
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Model } from "mongoose";
import * as mongoose from "mongoose";
import { PaymentMethods } from "../src/models/payment-methods.enum";
import { OrderStatus } from "../src/models/order-status.enum";

let app: INestApplication;
let orderModel: Model<OrderDoc>;
let productModel: Model<ProductDoc>;
let clientModel: Model<ClientDoc>;
let storeModel: Model<StoreDoc>;

let order;
let product;
let store;

const init = async () => {
  store = new storeModel({id: new mongoose.Types.ObjectId().toHexString()});
  await store.save();

  product = new productModel({
    id:new mongoose.Types.ObjectId().toHexString(),
    name: 'test product',
    price: 120,
    stock: 100,
    image: 'test image',
    storeId: store.id,
    version: 1
  });
  await product.save();

  const client = new clientModel({
    firstName: 'sinda',
    lastName: 'jeddey',
    email: 'stuff@stuff.com',
    phoneNumber: '852741',
    address: {
      street: 'mimosas',
      city: 'TUNIS',
      state: 'TUNIS',
      zipCode: '2045'
    }});
  await client.save();

  order = new orderModel({
    storeId: store.id,
    paymentMethod: PaymentMethods.CASH,
    products: [{ id: product.id, orderedQuantity: 5 }],
    totalPrice:720,
    orderDate: new Date(),
    client
  });
  await order.save();
}

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      rootMongooseTestModule(),
      MongooseModule.forFeature([
        {name: 'Order', schema: OrderSchema},
        {name: 'Product', schema: ProductSchema},
        {name: 'Client', schema: ClientSchema},
        {name: 'Store', schema: StoreSchema}
      ]),
    ],
    providers: [OrdersService],
    controllers:[OrdersController]
  }).compile();
  orderModel = module.get<Model<OrderDoc>>('OrderModel');
  productModel = module.get<Model<ProductDoc>>('ProductModel');
  clientModel = module.get<Model<ClientDoc>>('ClientModel');
  storeModel = module.get<Model<StoreDoc>>('StoreModel');
  app = module.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  await init();
});

describe("Fetch orders", () => {
  it("Should return 200 if store orders are fetched",async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/api/orders/${store.id}`)
      .expect(200);
    expect(body.length).toEqual(1);
  });
  it.todo("Should throw 403 unauthorized error if store owner not authenticated");
});

describe('Fetch Order',() => {
  it("Should throw other than 200 and 403 if problems occur in the service", async () => {
    const { status, body } = await request(app.getHttpServer())
      .get(`/api/orders/${store.id}/order/${new mongoose.Types.ObjectId().toHexString()}`);
    expect(status).not.toEqual(403);
    expect(status).not.toEqual(200);
  })
  it("Should return 200 if order is fetched", async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/api/orders/${store.id}/order/${order.id}`)
      .expect(200);
    expect(body.status).toEqual(OrderStatus.PENDING);
  });

  it.todo("Should throw 403 unauthorized error if store owner not authenticated");
});

describe('Create an order', () => {
  it("Should 400 bad request error if request body is incompatible", async () => {
    const newOrder = {
      storeId: store.id,
      paymentMethod: 'something',
      products: [{ id: product.id, orderedQuantity: 5 }],
      client: {
        firstName: 'sinda',
        lastName: 'jeddey',
        email: 'stuff@stuff.com',
        phoneNumber: '852741',
        address: {
          street: 'mimosas',
          city: 'TUNIS',
          state: 'TUNIS',
          zipCode: '2045'
        }
      }
    }
    await request(app.getHttpServer())
      .post('/api/orders')
      .send(newOrder)
      .expect(400);
  });
  it("Should return 201 order created",async () => {
    const newOrder = {
      storeId: store.id,
      paymentMethod: PaymentMethods.CREDIT_CARD,
      products: [{ id: product.id, orderedQuantity: 5 }],
      client: {
        firstName: 'sinda',
        lastName: 'jeddey',
        email: 'stuff@stuff.com',
        phoneNumber: '852741',
        address: {
          street: 'mimosas',
          city: 'TUNIS',
          state: 'TUNIS',
          zipCode: '2045'
        }
      }
    }
    await request(app.getHttpServer())
      .post('/api/orders')
      .send(newOrder)
      .expect(201);
  });
});

describe('Update an Order',() => {
  it("Should throw other than 201 and 403 if problems occur in the service", async () => {
    order.set({ status: OrderStatus.CONFIRMED });
    await order.save();
    const {status} = await request(app.getHttpServer())
      .put(`/api/orders/${store.id}/${order.id}`)
      .send({status: OrderStatus.PENDING})
    expect(status).not.toEqual(403);
    expect(status).not.toEqual(404);
    expect(status).not.toEqual(200);
  });
  it("Should return 200 if order is correctly updated",async () => {
    await request(app.getHttpServer())
      .put(`/api/orders/${store.id}/${order.id}`)
      .send({status: OrderStatus.PENDING})
      .expect(200);
  });
  it.todo("Should throw 403 unauthorized error if store owner not authenticated");
});

afterAll(async () => {
  await app.close();
});
