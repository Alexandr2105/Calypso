import { NestFactory } from '@nestjs/core';
import { FilesMicroserviceModule } from './files-microservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function bootstrap() {
  const rawApp = await NestFactory.create(FilesMicroserviceModule);
  await rawApp.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://nvvffhzg:kunlrWhEIXXBPudNmmJTPT20KOCf8-80@stingray.rmq.cloudamqp.com/nvvffhzg',
      ],
      queue: 'FILES_SERVICE_RMQ',
      queueOptions: {
        durable: false,
      },
    },
  });
  // await microserviceRMQ.listen();

  // await rawApp.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: { port: 3001 },
  // });
  // await microserviceTCP.listen();
  await rawApp.startAllMicroservices();
  await rawApp.listen(3002);
}
bootstrap();
