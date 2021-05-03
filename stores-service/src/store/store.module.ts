import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { StoreSchema } from './schemas/store.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateService } from '../template/template.service';
import { TemplateController } from '../template/template.controller';
import { TemplateSchema } from '../template/schemas/template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Store', schema: StoreSchema },
      { name: 'Template', schema: TemplateSchema },
    ]),
  ],
  controllers: [StoreController, TemplateController],
  providers: [StoreService, TemplateService],
})
export class StoreModule {}
