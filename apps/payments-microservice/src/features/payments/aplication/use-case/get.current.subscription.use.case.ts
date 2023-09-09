import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsRepository } from '../../infrastructure/payments.repository';
import { SubscriptionsEntity } from '../../entities/subscriptions.entity';
import { NotFoundException } from '@nestjs/common';

export class GetCurrentSubscriptionCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetCurrentSubscriptionCommand)
export class GetCurrentSubscriptionUseCase
  implements ICommandHandler<GetCurrentSubscriptionCommand>
{
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute(command: GetCurrentSubscriptionCommand): Promise<any> {
    const subscription: SubscriptionsEntity =
      await this.paymentsRepository.getSubscriptionCurrentUser(command.userId);
    if (subscription) {
      return {
        userId: subscription.userId,
        expireAt: subscription.endDateOfSubscription,
      };
    } else {
      throw new NotFoundException();
    }
  }
}
