import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsRepository } from '../../infrastructure/payments.repository';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubscriptionsEntity } from '../../entities/subscriptions.entity';
import { DataPaymentsType } from '../../../../../../calypso/src/common/types/data.payments.type';

export class UpdatePaymentDataCommand {
  constructor(public data: any, public dataPayments: DataPaymentsType) {}
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
    const paymentsId = command.dataPayments.paymentsId;
    const subscription =
      await this.paymentsRepository.getSubscriptionByPaymentsId(paymentsId);
    let data: SubscriptionsEntity;
    if (!subscription.dateOfPayments && !subscription.endDateOfSubscription) {
      const endDateOfSubscription = new Date(updatedAt);
      endDateOfSubscription.setHours(
        endDateOfSubscription.getHours() + subscription.theAmountOfHours,
      );
      data = await this.paymentsRepository.updatePayment(
        paymentsId,
        allDataPaymentConfirm,
        updatedAt,
        'Success',
        endDateOfSubscription,
      );
    } else if (subscription.endDateOfSubscription > updatedAt) {
      const endDateOfSubscription = new Date(
        subscription.endDateOfSubscription,
      );
      endDateOfSubscription.setHours(
        endDateOfSubscription.getHours() + subscription.theAmountOfHours,
      );
      data = await this.paymentsRepository.updatePayment(
        paymentsId,
        allDataPaymentConfirm,
        updatedAt,
        'Success',
        endDateOfSubscription,
      );
    } else {
      const endDateOfSubscription = new Date(updatedAt);
      endDateOfSubscription.setHours(
        endDateOfSubscription.getHours() + subscription.theAmountOfHours,
      );
      data = await this.paymentsRepository.updatePayment(
        paymentsId,
        allDataPaymentConfirm,
        updatedAt,
        'Success',
        endDateOfSubscription,
      );
    }
    const pattern = { cmd: 'successPayment' };
    this.clientRMQ.emit(pattern, {
      userId: data.userId,
      endDateOfSubscription: data.endDateOfSubscription,
      subscriptionType: data.subscriptionType,
    });
  }
}
