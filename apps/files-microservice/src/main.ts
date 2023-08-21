import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FilesMicroserviceModule } from './files-microservice.module';
import { settings } from './settings';

export async function bootstrap() {
  const microserviceRMQ =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      FilesMicroserviceModule,
      {
        transport: Transport.RMQ,
        options: {
          // urls: [settings.RABBIT_MQ],
          urls: [
            'amqps://mnarqdfe:x90bjcNdFH5tO9OleEXq-aRnqennJuhE@stingray.rmq.cloudamqp.com/mnarqdfe',
          ],
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
        options: {
          port: 3043,
          host: '0.0.0.0',
        },
      },
    );
  await microserviceTCP.listen();

  console.log('Microservices are starting');
}
bootstrap();
