import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { PaymentsEntity } from '../../entities/payments.entity';
import { PaymentType } from '@prisma/client';
import { PaymentsRepository } from '../../infrastructure/payments.repository';
import { SubscriptionsEntity } from '../../entities/subscriptions.entity';

export class SavePaymentsDataCommand {
  constructor(
    public data: Stripe.Response<Stripe.Checkout.Session>,
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
      paymentsId: command.data.client_reference_id,
      price: command.data.amount_total,
      paymentStatus: 'Pending',
      paymentSystem: command.paymentSystem,
      allDataPayment: JSON.parse(JSON.stringify(command.data)),
      createdAt: new Date(),
    };
    const subscription: SubscriptionsEntity = {
      userId: command.userId,
      paymentsId: command.data.client_reference_id,
      price: command.data.amount_total,
      paymentsType: 'Pending',
      subscriptionType: 'Business',
      theAmountOfHours: command.quantity,
    };
    await this.paymentsRepository.savePayment(payment, subscription);
  }
}
