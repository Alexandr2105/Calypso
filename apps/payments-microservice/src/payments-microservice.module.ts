import { Module } from '@nestjs/common';
import { PaymentsMicroserviceController } from './payments-microservice.controller';
import { PaymentsMicroserviceService } from './payments-microservice.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';
import { PaymentsController } from './features/payments/api/payments.controller';
import { ApiConfigService } from './common/helper/api.config.service';
import { ConfigModule } from '@nestjs/config';
import { PaypalAdapter } from './common/adapters/paypal.adapter';
import { StripeAdapter } from './common/adapters/stripe.adapter';
import { PaymentManager } from './common/managers/payment.manager';
import { PaymentsRepository } from './features/payments/infrastructure/payments.repository';
import { PrismaModule } from './common/prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CheckProductInDbUseCase } from './features/payments/aplication/use-case/check.product.in.db.use.case';
import { SavePaymentsDataUseCase } from './features/payments/aplication/use-case/save.payments.data.use.case';
import { UpdatePaymentDataUseCase } from './features/payments/aplication/use-case/update.payment.data.use.case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'PAYMENTS_SERVICE_RMQ',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ],
          queue: 'PAYMENTS_SERVICE_RMQ',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    PrismaModule,
    CqrsModule,
  ],
  controllers: [PaymentsMicroserviceController, PaymentsController],
  providers: [
    PaymentsMicroserviceService,
    ApiConfigService,
    PaymentManager,
    PaymentsRepository,
    CheckProductInDbUseCase,
    SavePaymentsDataUseCase,
    UpdatePaymentDataUseCase,
    {
      provide: 'PaypalAdapter',
      useClass: PaypalAdapter,
    },
    {
      provide: 'StripeAdapter',
      useClass: StripeAdapter,
    },
  ],
})
export class PaymentsMicroserviceModule {}
