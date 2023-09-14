import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exception.filter';
import { useContainer } from 'class-validator';
import { createApp } from './common/helpers/createApp';
import * as process from 'process';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = createApp(rawApp);
  app.setGlobalPrefix('api/v1');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Instagram')
    .setDescription('The Instagram API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ],
      queue: 'PAYMENTS_SERVICE_RMQ',
      queueOptions: {
        durable: false,
      },
      noAck: false,
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT || 3000, () => {
    console.log(`App started at ${process.env.PORT || 3000} port`);
  });
}
bootstrap();
