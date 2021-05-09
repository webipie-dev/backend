import * as mongoose from "mongoose";
import { NewOrderDto } from "../models/dto/new-order.dto";
import { PaymentMethods } from "../models/payment-methods.enum";
import { OrdersService } from "./orders.service";
import { Test, TestingModule } from "@nestjs/testing";
import { rootMongooseTestModule } from "../../test/setup";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderDoc, OrderSchema } from "../models/order";
import { ProductDoc, ProductSchema } from "../models/product";
import { ClientDoc, ClientSchema } from "../models/client";
import { StoreDoc, StoreSchema } from "../models/store";
import { Model } from "mongoose";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { OrderStatus } from "../models/order-status.enum";

let ordersService: OrdersService;
let orderModel: Model<OrderDoc>;
let productModel: Model<ProductDoc>;
let clientModel: Model<ClientDoc>;
let storeModel: Model<StoreDoc>;

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
const newProduct = {
  id:new mongoose.Types.ObjectId().toHexString(),
  name: 'test product',
  price: 120,
  stock: 100,
  image: 'test image',
  storeId: 'storeId',
  version: 1
}
let store;

const init = async (newProduct, newOrder) => {
  store = new storeModel({id: newOrder.storeId});
  await store.save();
  newOrder.storeId = store.id;
}
const createOrder = async () => {
  await init(newProduct, newOrder);
  newProduct.storeId = store.id;
  const product = new productModel(newProduct);
  await product.save();
  newOrder.products[0].id = product.id;
  return await ordersService.createOrder(newOrder);
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
    providers: [OrdersService]
  }).compile();
  ordersService = module.get<OrdersService>(OrdersService);
  orderModel = module.get<Model<OrderDoc>>('OrderModel');
  productModel = module.get<Model<ProductDoc>>('ProductModel');
  clientModel = module.get<Model<ClientDoc>>('ClientModel');
  storeModel = module.get<Model<StoreDoc>>('StoreModel');
});

describe("Fetch All orders", () => {
  it("Should return all orders", async () => {
    const storeId = new mongoose.Types.ObjectId().toHexString();
    const orders = await ordersService.getOrders(storeId);

    expect(orders.length).toEqual(0);
  });
})

describe("Create an order", () => {
  it("should throw an error if store doesn't exist", async () => {
    await expect(ordersService.createOrder(newOrder))
      .rejects
      .toThrowError(NotFoundException);
    await expect(ordersService.createOrder(newOrder))
      .rejects
      .toThrowError(`Store ${newOrder.storeId} Not Found`);
  });
  it("should throw 404 not found error if one the ordered products doesn't exist", async () => {
    await init(newProduct, newOrder);

    await expect(ordersService.createOrder(newOrder))
      .rejects
      .toThrowError(NotFoundException);
    await expect(ordersService.createOrder(newOrder))
      .rejects
      .toThrowError(`Product with id ${newOrder.products[0].id} Not Found`);
  });
  it("should throw 400 bad request error if one of the ordered quantities is over the stock", async () => {
    await init(newProduct, newOrder);
    newProduct.storeId = store.id;
    const product = new productModel(newProduct);
    await product.save();
    newOrder.products[0].id = product.id;

    await expect(ordersService.createOrder(newOrder))
      .rejects
      .toThrowError(BadRequestException);
    await expect(ordersService.createOrder(newOrder))
      .rejects
      .toThrowError("Ordered quantity is more than the available stock");

  });
  it("should throw 400 bad request error if the store id in the product not compatible with the store id in the order", async () => {
    await init(newProduct, newOrder);
    newProduct.storeId = new mongoose.Types.ObjectId().toHexString();
    const product = new productModel(newProduct);
    await product.save();
    newOrder.products[0].id = product.id;

    await expect(ordersService.createOrder(newOrder))
      .rejects
      .toThrowError(BadRequestException);
    await expect(ordersService.createOrder(newOrder))
      .rejects
      .toThrowError("Product available within another store");
  });
  it("should create a new client if a new client orders", async () => {
    await init(newProduct, newOrder);
    newProduct.storeId = store.id;
    const product = new productModel(newProduct);
    await product.save();
    newOrder.products[0].id = product.id;

    const order = await ordersService.createOrder(newOrder);
    const client = await clientModel.findOne({phoneNumber: order.client.phoneNumber});

    expect(client).toBeDefined();
    expect(client.firstName).toEqual(order.client.firstName);
  });
  it("should create a new order if everything goes well: test price, status, payment method", async () => {
    await init(newProduct, newOrder);
    newProduct.storeId = store.id;
    const product = new productModel(newProduct);
    await product.save();
    newOrder.products[0].id = product.id;

    const order = await ordersService.createOrder(newOrder);
    const orders = await orderModel.find({});

    expect(order).toBeDefined();
    expect(orders.length).toEqual(1);
    expect(order.status).toEqual(OrderStatus.PENDING);
    expect(order.totalPrice).toEqual(600);
    expect(order.paymentMethod).toEqual(newOrder.paymentMethod);
  });

  it.todo("should publish order:created event");
})

describe("Update an order",() => {
  it("Should throw 404 not found error if order not found in store owner store", async () =>{
    const order = await createOrder();

    await expect(ordersService.updateOrder(order.id,
      {
        status: OrderStatus.CONFIRMED
      }, new mongoose.Types.ObjectId().toHexString()))
      .rejects
      .toThrowError(NotFoundException);
    await expect(ordersService.updateOrder(order.id,
      {
        status: OrderStatus.CONFIRMED
      }, new mongoose.Types.ObjectId().toHexString()))
      .rejects
      .toThrowError('Order Not Found in Current Store');
  });
  it("Should throw 404 not found error if order cancelled", async () => {
    const order = await createOrder();
    order.set({status: OrderStatus.CANCELLED});

    await order.save();


    await expect(ordersService.updateOrder(order.id,
      {
        status: OrderStatus.CONFIRMED
      }, order.storeId))
      .rejects
      .toThrowError(NotFoundException);
    await expect(ordersService.updateOrder(order.id,
      {
        status: OrderStatus.CONFIRMED
      }, order.storeId))
      .rejects
      .toThrowError('Order Not Found in Current Store');
  });
  it("Should throw 400 bad request error when updating from CONFIRMED to PENDING", async () => {
    const order = await createOrder();
    order.set({status: OrderStatus.CONFIRMED});
    await order.save();

    await expect(ordersService.updateOrder(order.id,
      {
        status: OrderStatus.PENDING
      }, order.storeId))
      .rejects
      .toThrowError(BadRequestException);
    await expect(ordersService.updateOrder(order.id,
      {
        status: OrderStatus.PENDING
      }, order.storeId))
      .rejects
      .toThrowError('Can\'t update order status from CONFIRMED to PENDING');

  });
  it("Should throw 400 bad request error when updating from CONFIRMED to CANCELLED", async () => {
    const order = await createOrder();
    order.set({status: OrderStatus.CONFIRMED});
    await order.save();

    await expect(ordersService.updateOrder(order.id,
      {
        status: OrderStatus.CANCELLED
      }, order.storeId))
      .rejects
      .toThrowError(BadRequestException);
    await expect(ordersService.updateOrder(order.id,
      {
        status: OrderStatus.CANCELLED
      }, order.storeId))
      .rejects
      .toThrowError('Can\'t update order status from CONFIRMED to CANCELLED');
  });
  it("Should update the order status to CONFIRMED or CANCELLED", async () => {
    const order = await createOrder();
    const updatedOrder = await ordersService.updateOrder(order.id, {status: OrderStatus.CONFIRMED}, order.storeId);

    expect(updatedOrder.status).toBeDefined();
    expect(updatedOrder.status).toEqual(OrderStatus.CONFIRMED);
  });

  it.todo("Should publish order:updated event");
})

describe("Fetch an order", () => {
  it("Should throw 404 not found error if order not found",async () => {
    const storeId = new mongoose.Types.ObjectId().toHexString();
    const orderId = new mongoose.Types.ObjectId().toHexString();

    await expect(ordersService.getOrder(orderId, storeId))
      .rejects
      .toThrow(NotFoundException);
    await expect(ordersService.getOrder(orderId, storeId))
      .rejects
      .toThrow(`Order ${orderId} not found in current store`);
  });
  it("Should throw 404 not found error if store not found", async () => {
    const order = await createOrder();
    await order.save();

    const storeId = new mongoose.Types.ObjectId().toHexString();

    await expect(ordersService.getOrder(order.id, storeId))
      .rejects
      .toThrow(NotFoundException);
    await expect(ordersService.getOrder(order.id, storeId))
      .rejects
      .toThrow(`Store ${storeId} not found`);
  });
  it("Should throw 404 not found error if the order doesn't belong to the store of the store owner", async () => {
    const order = await createOrder();
    const storeId = new mongoose.Types.ObjectId().toHexString();

    await expect(ordersService.getOrder(order.id,storeId))
      .rejects
      .toThrow(NotFoundException);
    await expect(ordersService.getOrder(order.id, storeId))
      .rejects
      .toThrow(`Order ${order.id} not found in current store`);
  });
  it("Should fetch the order: test status, client if its fetched by the client, is defined", async () => {
    const order = await createOrder();
    const fetchedOrder = await ordersService.getOrder(order.id, order.storeId);

    expect(fetchedOrder).toBeDefined();
    expect(fetchedOrder.status).toEqual(order.status);
    expect(fetchedOrder.client).toBeDefined();
    expect(fetchedOrder.client.lastName).toEqual(order.client.lastName);
  });
});

afterEach(() => {
  orderModel.deleteMany({});
  productModel.deleteMany({});
  storeModel.deleteMany({});
  clientModel.deleteMany({});
})
