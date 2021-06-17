import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

@Module({
  imports: [
    ProductModule,
    StoreModule,
    MongooseModule.forRoot(config.mongoURI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
