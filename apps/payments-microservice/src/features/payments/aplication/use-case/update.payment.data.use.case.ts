import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { PaymentsRepository } from '../../infrastructure/payments.repository';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubscriptionsEntity } from '../../entities/subscriptions.entity';

export class UpdatePaymentDataCommand {
  constructor(public data: Stripe.Checkout.Session) {}
}

@CommandHandler(UpdatePaymentDataCommand)
export class UpdatePaymentDataUseCase
  implements ICommandHandler<UpdatePaymentDataCommand>
{
  constructor(
    private paymentsRepository: PaymentsRepository,
    @Inject('PAYMENTS_SERVICE_RMQ') private clientRMQ: ClientProxy,
  ) {}

  async execute(command: UpdatePaymentDataCommand) {
    const allDataPaymentConfirm = JSON.parse(JSON.stringify(command.data));
    const updatedAt = new Date();
    const paymentsId = command.data.client_reference_id;
    const subscription = await this.paymentsRepository.getSubscriptionById(
      paymentsId,
    );
    const endDateOfSubscription = new Date(updatedAt);
    endDateOfSubscription.setHours(
      endDateOfSubscription.getHours() + subscription.theAmountOfHours,
    );
    const data: SubscriptionsEntity =
      await this.paymentsRepository.updatePayment(
        paymentsId,
        allDataPaymentConfirm,
        updatedAt,
        'Success',
        endDateOfSubscription,
      );
    const pattern = { cmd: 'successPayment' };
    this.clientRMQ.emit(pattern, {
      userId: data.userId,
      endDateOfSubscription: data.endDateOfSubscription,
      subscriptionType: data.subscriptionType,
    });
  }
}
