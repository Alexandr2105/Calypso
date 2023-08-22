import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FilesMicroserviceModule } from './files-microservice.module';
import { ConfigService } from '@nestjs/config';

export async function bootstrap() {
  const app = await NestFactory.create(FilesMicroserviceModule);
  const configService = app.get(ConfigService);

  const microserviceRMQ = await app.connectMicroservice<MicroserviceOptions>({
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
  });
  await microserviceRMQ.listen();

  const microserviceTCP = await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 3001,
      // host: 'files-microservice.kustogram-site',
    },
  });
  await microserviceTCP.listen();

  console.log('Microservices are starting');
}
bootstrap();
