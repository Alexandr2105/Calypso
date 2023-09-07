import { NestFactory } from '@nestjs/core';
import { PaymentsMicroserviceModule } from './payments-microservice.module';
import process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsMicroserviceModule, {
    rawBody: true,
  });

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: ['https://kustogram.site/api/v1', 'http://localhost:3000'],
  });

  const config = new DocumentBuilder()
    .setTitle('Instagram')
    .setDescription('The Instagram API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, document);

  await app.listen(process.env.PORT || 3002, () => {
    console.log(`App started at ${process.env.PORT || 3002} port`);
  });
}
bootstrap();
