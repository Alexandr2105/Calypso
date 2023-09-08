import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsRepository } from '../../infrastructure/payments.repository';

export class GetAllSubscriptionsCommand {}

@CommandHandler(GetAllSubscriptionsCommand)
export class GetAllSubscriptionsUseCase
  implements ICommandHandler<GetAllSubscriptionsCommand>
{
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute() {
    return this.paymentsRepository.getProductsSubscriptions();
  }
}
