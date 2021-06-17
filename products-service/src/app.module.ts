import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ProductModule,
    StoreModule,
    MongooseModule.forRoot(
      process.env.DATABASE_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
