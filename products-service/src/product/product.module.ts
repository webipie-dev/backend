import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from '../schemas/store.schema';
import { ProductSchema } from '../schemas/product.schema';
import { StoreService } from '../store/store.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Store', schema: StoreSchema },
      { name: 'Product', schema: ProductSchema },
    ]),
  ],
  providers: [ProductService, StoreService],
  controllers: [ProductController],
})
export class ProductModule {}
