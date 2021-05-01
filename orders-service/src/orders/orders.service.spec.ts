import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrderSchema } from "../models/order";
import { ProductSchema } from "../models/product";
import { ClientSchema } from "../models/client";
import { rootMongooseTestModule } from "../../test/setup";
import * as mongoose from "mongoose";
import { NewOrderDto } from "../models/dto/new-order.dto";
import { PaymentMethods } from "../models/payment-methods.enum";
import { StoreSchema } from "../models/store";
import { NotFoundError } from "@middleware-errors/common";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { Model } from "mongoose";

let service: OrdersService;

beforeAll(async () => {
  const testModule: TestingModule = await Test.createTestingModule({
    imports: [
      rootMongooseTestModule(),
      MongooseModule.forFeature([
        {name: 'Order', schema: OrderSchema},
        {name: 'Product', schema: ProductSchema},
        {name: 'Client', schema: ClientSchema},
        {name: 'Store', schema: StoreSchema},
      ])],
    providers: [
      {
        provide: getModelToken('Store'),
        useValue: Model
      },
      OrdersService],
  }).compile();
  service = testModule.get<OrdersService>(OrdersService);
});

describe("Fetch All orders", () => {
  it.todo("Should throw 403 unauthorized error if store owner not authenticated");
  it("Should return all orders", async () => {
    const storeId = new mongoose.Types.ObjectId().toHexString();
    const orders = await service.getOrders(storeId);
    expect(orders.length).toEqual(0);
  });
})

describe("Fetch an order", () => {
  it.todo("Should throw 403 unauthorized error if store owner not authenticated");
  it.todo("Should throw 404 not found error if order not found");
  it.todo("Should throw 404 not found error if order was cancelled in the past");
  it.todo("Should throw an error if the client fetching the order is not the client who ordered it");
  it.todo("Should throw 404 not found error if the order doesn't belong to the store of the store owner");
  it.todo("Should fetch the order: test status, client if its fetched by the client, is defined");
});

describe("Create an order", () => {
  const newOrder: NewOrderDto = {
    storeId: new mongoose.Types.ObjectId().toHexString(),
    paymentMethod: PaymentMethods.CASH,
    products: [{ id: new mongoose.Types.ObjectId().toHexString(), orderedQuantity: 5 }],
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

  it("should throw an error if store doesn't exist", async () => {
    await expect(service.createOrder(newOrder)).rejects.toThrowError(NotFoundError);
  });
  it.todo("should throw 404 not found error if one the ordered products doesn't exist");
  it.todo("should throw 400 bad request error if one of the ordered quantities is over the stock");
  it.todo("should throw 400 bad request error if the store id in the product not compatible with the store id in the order");
  it.todo("should create a new client if a new client orders ");
  it.todo("should create a new order if everything goes well: test price, status, payment method");
  it.todo("should publish order:created event");
})

describe("Update an order",() => {
  it.todo("Should throw 403 unauthorized error if store owner not authenticated");
  it.todo("Should throw 404 not found error if order not found in store owner store");
  it.todo("Should throw 404 not found error if order cancelled");
  it.todo("Should throw 404 not found error if store owner is trying to update an order from another store");
  it.todo("Should throw 400 bad request error when updating from CONFIRMED to PENDING");
  it.todo("Should throw 400 bad request error when updating from CONFIRMED to CANCELLED");
  it.todo("Should update thr order status to CONFIRMED or CANCELLED");
})
