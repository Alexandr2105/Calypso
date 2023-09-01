import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FilesMicroserviceModule } from './files-microservice.module';
import * as process from 'process';

export async function bootstrap() {
  const microserviceTCP =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      FilesMicroserviceModule,
      {
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: Number(process.env.PORT) || 3001,
        },
      },
    );
  await microserviceTCP.listen();

  console.log('Microservices are starting ' + (process.env.PORT || 3001));
}
bootstrap();
