import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FilesMicroserviceModule } from './files-microservice.module';
import { settings } from './settings';

export async function bootstrap() {
  const app = await NestFactory.create(FilesMicroserviceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: 3001 },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [settings.RABBIT_MQ],
      queue: 'FILES_SERVICE_RMQ',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002);
  // const microserviceRMQ =
  //   await NestFactory.createMicroservice<MicroserviceOptions>(
  //     FilesMicroserviceModule,
  //     {
  //       transport: Transport.RMQ,
  //       options: {
  //         urls: [settings.RABBIT_MQ],
  //         queue: 'FILES_SERVICE_RMQ',
  //         queueOptions: {
  //           durable: false,
  //         },
  //       },
  //     },
  //   );
  // await microserviceRMQ.listen();
  //
  // const microserviceTCP =
  //   await NestFactory.createMicroservice<MicroserviceOptions>(
  //     FilesMicroserviceModule,
  //     {
  //       transport: Transport.TCP,
  //       options: { port: 3001 },
  //     },
  //   );
  // await microserviceTCP.listen();

  console.log('Microservices are starting 3002');
}
bootstrap();
