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
