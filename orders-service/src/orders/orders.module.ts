import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from "@nestjs/mongoose";
import { OrderSchema } from "../models/order";
import { ProductSchema } from "../models/product";
import { ClientSchema } from "../models/client";
import { StoreSchema } from "../models/store";

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'Order', schema: OrderSchema},
    {name: 'Product', schema: ProductSchema},
    {name: 'Client', schema: ClientSchema},
    {name: 'Store', schema: StoreSchema}
    ]
  )],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
