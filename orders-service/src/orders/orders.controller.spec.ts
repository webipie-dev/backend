import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { rootMongooseTestModule } from "../../test/setup";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderDoc, OrderSchema } from "../models/order";
import { ProductDoc, ProductSchema } from "../models/product";
import { ClientDoc, ClientSchema } from "../models/client";
import { StoreDoc, StoreSchema } from "../models/store";
import { OrdersService } from "./orders.service";
import { NewOrderDto } from "../models/dto/new-order.dto";
import mongoose from "mongoose";
import { PaymentMethods } from "../models/payment-methods.enum";
import { UpdateOrderDto } from "../models/dto/update-order.dto";
import { OrderStatus } from "../models/order-status.enum";

const mockOrdersService = {
  createOrder: jest.fn((newOrder: NewOrderDto) => {
    return {
      id: 'someId',
      ...newOrder
    }
  }),
  getOrder: jest.fn((orderId: string, storeId:string) => {
    return {
      storeId,
      orderId,
      paymentMethod: PaymentMethods.CASH
    }
  }),
  updateOrder: jest.fn((orderId: string, updates: UpdateOrderDto, storeId: string) => {
    return {
      orderId,
      storeId,
      ...updates
    }
  }),
  getOrders: jest.fn((storeId: string) => {
    return [
      {
        storeId
      }
    ]
  })
}
let controller;

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
  }).overrideProvider(OrdersService)
    .useValue(mockOrdersService)
    .compile();

  controller = module.get<OrdersController>(OrdersController);
});

it("should create an order", async () => {
  const newOrder: NewOrderDto = {
    storeId: 'storeId',
    paymentMethod: PaymentMethods.CASH,
    products: [{ id: 'productId', orderedQuantity: 5 }],
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
  expect(await controller.createOrder(newOrder)).toEqual(expect.objectContaining({
    id: expect.any(String),
    paymentMethod: PaymentMethods.CASH
  }))
  expect(mockOrdersService.createOrder).toHaveBeenCalled();
});

it("should fetch an order by id and by store id", async () => {
  expect(await controller.getOrder('storeId','orderId')).toEqual({
    orderId: 'orderId',
    storeId: 'storeId',
    paymentMethod: PaymentMethods.CASH
  });
  expect(mockOrdersService.getOrder).toHaveBeenCalled();
});

it("should fetch orders of specific store", async () => {
  expect(await controller.getOrders('storeId')).toContainEqual({
    storeId: 'storeId'
  });
  expect(mockOrdersService.getOrders).toHaveBeenCalledWith('storeId')
});

it("should update an order", async () => {
  expect(await controller.updateOrder('orderId', 'storeId',{status: OrderStatus.CANCELLED})).toEqual({
    orderId: 'orderId',
    storeId: 'storeId',
    status: OrderStatus.CANCELLED
  });
  expect(mockOrdersService.updateOrder).toHaveBeenCalledWith('orderId', {status: OrderStatus.CANCELLED}, 'storeId')
});
