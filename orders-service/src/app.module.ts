import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.DATABASE_URI,
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
