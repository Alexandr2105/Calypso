import { NestFactory } from '@nestjs/core';
import { FilesMicroserviceModule } from './files-microservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function bootstrap() {
  const microserviceRMQ =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      FilesMicroserviceModule,
      {
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://nvvffhzg:kunlrWhEIXXBPudNmmJTPT20KOCf8-80@stingray.rmq.cloudamqp.com/nvvffhzg',
          ],
          queue: 'FILES_SERVICE',
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
}
bootstrap();
