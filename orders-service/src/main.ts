import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from "@webipie/common";
import { LoggingInterceptor } from "./logging/logging.interceptor";
import { CustomStrategy } from '@nestjs/microservices'
import { Listener } from '@nestjs-plugins/nestjs-nats-streaming-transport';

async function bootstrap() {
  const productCreatedStrategy: CustomStrategy = {
    strategy: new Listener(
      process.env.NATS_CLUSTER_ID /* clusterID */,
      process.env.NATS_CLIENT_ID /* clientID */,
      'products-service-queue-group', /* queueGroupName */
      {
        url: process.env.NATS_URL
      } /* TransportConnectOptions */,
      {
        durableName: 'products-service-queue-group',
        manualAckMode: true,
        deliverAllAvailable: true,
      } /* TransportSubscriptionOptions */ ,
    ),
  };
  
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor('Orders Service'));
  app.connectMicroservice(productCreatedStrategy);
  app.startAllMicroservices();
  app.listen(3000, () => console.log('Orders Service is up finally!!!'));

}
bootstrap();
