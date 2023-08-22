import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FilesMicroserviceModule } from './files-microservice.module';
import * as process from 'process';

console.log(process.env.MONGO_DB);
console.log({ url: process.env.MONGO_DB });

export async function bootstrap() {
  // const app = await NestFactory.create(FilesMicroserviceModule);
  // const configService = app.get(ConfigService);

  const microserviceRMQ =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      FilesMicroserviceModule,
      {
        transport: Transport.RMQ,
        options: {
          // urls: [configService.get('RABBIT_MQ')],
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
          // host: '0.0.0.0',
          // port: 3043,
          port: 3001,
        },
      },
    );
  await microserviceTCP.listen();

  console.log(parseInt(process.env.PORT));
  console.log('Microservices are starting');
}
bootstrap();
