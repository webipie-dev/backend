import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
  import { rootMongooseTestModule } from "../../test/setup";
  import { MongooseModule } from "@nestjs/mongoose";
  import { OrderSchema } from "../models/order";
  import { ProductSchema } from "../models/product";
  import { ClientSchema } from "../models/client";
  import { StoreSchema } from "../models/store";
  import { OrdersService } from "./orders.service";

let controller: OrdersController;

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
      providers: [OrdersService],
      controllers: [OrdersController],
  }).compile();
    controller = testModule.get<OrdersController>(OrdersController);
});

describe('Create an order', () => {
  it.todo("Throw bad request error if request body is incompatible");
});
