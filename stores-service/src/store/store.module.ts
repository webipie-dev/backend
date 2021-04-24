import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { StoreSchema } from './schemas/store.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
