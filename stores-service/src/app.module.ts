import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StoreModule } from './store/store.module';
import { TemplateModule } from './template/template.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/keys';

@Module({
  imports: [
    StoreModule,
    TemplateModule,
    MongooseModule.forRoot(config.mongoURI),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
