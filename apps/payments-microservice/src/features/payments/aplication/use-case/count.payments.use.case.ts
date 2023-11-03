import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsRepository } from '../../infrastructure/payments.repository';

export class CountPaymentCommand {}

@CommandHandler(CountPaymentCommand)
export class CountPaymentsUseCase
  implements ICommandHandler<CountPaymentCommand>
{
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute(): Promise<any> {
    return this.paymentsRepository.getAllPaymentsCount();
  }
}
