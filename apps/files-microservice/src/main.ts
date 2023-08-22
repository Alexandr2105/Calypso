import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FilesMicroserviceModule } from './files-microservice.module';
import { ConfigService } from '@nestjs/config';
import { settings } from './settings';

console.log(settings.DDDD);
console.log({ url: settings.DDDD });

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
      port: parseInt(process.env.PORT),
    },
  });
  await microserviceTCP.listen();

  console.log(parseInt(process.env.PORT));
  console.log('Microservices are starting');
}
bootstrap();
