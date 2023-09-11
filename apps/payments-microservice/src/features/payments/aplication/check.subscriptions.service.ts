import { PaymentsRepository } from '../infrastructure/payments.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionsEntity } from '../entities/subscriptions.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CheckSubscriptionsService {
  constructor(
    private paymentsRepository: PaymentsRepository,
    @Inject('PAYMENTS_SERVICE_RMQ') private clientRMQ: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async checkSubscription() {
    const subscriptions: SubscriptionsEntity[] =
      await this.paymentsRepository.getOldSubscriptions(new Date());
    if (subscriptions.length > 0) {
      for (const subscription of subscriptions) {
        await this.paymentsRepository.updateSubscriptionType(
          subscription.userId,
          'Personal',
        );
        const pattern = { cmd: 'cancelSubscription' };
        this.clientRMQ.emit(pattern, subscription.userId);
      }
    } else {
      return;
    }
  }
}
