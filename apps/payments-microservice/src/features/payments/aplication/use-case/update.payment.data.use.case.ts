import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Stripe from 'stripe';
import { PaymentsRepository } from '../../infrastructure/payments.repository';

export class UpdatePaymentDataCommand {
  constructor(public data: Stripe.Checkout.Session) {}
}

@CommandHandler(UpdatePaymentDataCommand)
export class UpdatePaymentDataUseCase
  implements ICommandHandler<UpdatePaymentDataCommand>
{
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute(command: UpdatePaymentDataCommand): Promise<string> {
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
    const data = await this.paymentsRepository.updatePayment(
      paymentsId,
      allDataPaymentConfirm,
      updatedAt,
      'Success',
      endDateOfSubscription,
    );
    // const s: SubscriptionsEntity = {
    //   userId: command.data.id,
    //   dateOfPayments: updatedAt,
    //   paymentsId: paymentsId,
    //   paymentsType: 'Success',
    //   price: command.data.amount_total,
    //   subscriptionType:"Business",
    //   endDateOfSubscription:
    // };
    // const data1 = await this.paymentsRepository.saveSubscriptionInfo();
    return 'asdf';
    // const pattern = { cmd: 'successPayment' };
    // this.clientRMQ.emit(pattern, {userId:});
  }
}
