import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from '../schemas/store.schema';
import { ProductSchema } from '../schemas/product.schema';
import { StoreService } from '../store/store.service';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport'

@Module({
  imports: [
    NatsStreamingTransport.register(
      {
       clientId: process.env.NATS_CLIENT_ID,
       clusterId: process.env.NATS_CLUSTER_ID,
       connectOptions: {
         url: process.env.NATS_URL,
       },
     }
    ),
    MongooseModule.forFeature([
      { name: 'Store', schema: StoreSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [ProductService, StoreService],
  controllers: [ProductController],
})
export class ProductModule {}
