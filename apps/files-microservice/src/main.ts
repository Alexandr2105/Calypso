import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FilesMicroserviceModule } from './files-microservice.module';
import { settings } from './settings';
import * as process from 'process';

export async function bootstrap() {
  const microserviceRMQ =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      FilesMicroserviceModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ],
          queue: 'FILES_SERVICE_RMQ',
          queueOptions: {
            durable: false,
          },
        },
      },
    );
  await microserviceRMQ.listen();

  const microserviceTCP =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      FilesMicroserviceModule,
      {
        transport: Transport.TCP,
        options: { port: 3001 },
      },
    );
  await microserviceTCP.listen();

  console.log('Microservices are starting');
}
bootstrap();
