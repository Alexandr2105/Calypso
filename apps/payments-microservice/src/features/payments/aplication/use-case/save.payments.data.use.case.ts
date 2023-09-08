import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsEntity } from '../../entities/payments.entity';
import { PaymentType } from '@prisma/client';
import { PaymentsRepository } from '../../infrastructure/payments.repository';
import { SubscriptionsEntity } from '../../entities/subscriptions.entity';
import { DataPaymentsType } from '../../../../common/types/data.payments.type';

export class SavePaymentsDataCommand {
  constructor(
    public data: any,
    public dataPayments: DataPaymentsType,
    public userId: string,
    public paymentSystem: PaymentType,
    public quantity: number,
  ) {}
}

@CommandHandler(SavePaymentsDataCommand)
export class SavePaymentsDataUseCase
  implements ICommandHandler<SavePaymentsDataCommand>
{
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute(command: SavePaymentsDataCommand): Promise<any> {
    const payment: PaymentsEntity = {
      userId: command.userId,
      paymentsId: command.dataPayments.paymentsId,
      price: command.dataPayments.price,
      paymentStatus: 'Pending',
      paymentSystem: command.paymentSystem,
      allDataPayment: JSON.parse(JSON.stringify(command.data)),
      createdAt: new Date(),
    };
    const subscription: SubscriptionsEntity = {
      userId: command.userId,
      paymentsId: command.dataPayments.paymentsId,
      price: command.dataPayments.price,
      paymentsType: 'Pending',
      subscriptionType: 'Business',
      theAmountOfHours: command.quantity,
    };
    const oldSubscription =
      await this.paymentsRepository.getSubscriptionCurrentUser(command.userId);
    if (oldSubscription) {
      await this.paymentsRepository.cretePaymentAndUpdateSubscription(
        payment,
        subscription,
      );
    } else {
      await this.paymentsRepository.savePayment(payment, subscription);
    }
  }
}
