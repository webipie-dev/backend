import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from '../schemas/store.schema';
import { StoreService } from './store.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
