import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://webipieDev:9Ado3XsOs5eypupV@webipie.9slkz.mongodb.net/orders?retryWrites=true&w=majority\n',
    ),
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
