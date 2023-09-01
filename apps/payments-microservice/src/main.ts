import { NestFactory } from '@nestjs/core';
import { PaymentsMicroserviceModule } from './payments-microservice.module';
import process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsMicroserviceModule, {
    rawBody: true,
  });

  app.enableCors({
    origin: ['https://kustogram.site/api/v1', 'http://localhost:3001'],
  });
  app;

  await app.listen(process.env.PORT || 3002, () => {
    console.log(`App started at ${process.env.PORT || 3002} port`);
  });
}
bootstrap();
