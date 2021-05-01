import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/orders-service',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    ),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
