import { Module } from '@nestjs/common';
import { PaymentsMicroserviceController } from './payments-microservice.controller';
import { PaymentsMicroserviceService } from './payments-microservice.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';
import { PaymentsController } from './features/payments/payments.controller';
import { ApiConfigService } from './common/helper/api.config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'FILES_SERVICE_RMQ',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ],
          queue: 'FILES_SERVICE_RMQ',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [PaymentsMicroserviceController, PaymentsController],
  providers: [PaymentsMicroserviceService, ApiConfigService],
})
export class PaymentsMicroserviceModule {}
