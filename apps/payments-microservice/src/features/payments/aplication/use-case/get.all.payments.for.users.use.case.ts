import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsRepository } from '../../infrastructure/payments.repository';
import { PaymentsEntity } from '../../entities/payments.entity';

export class GetAllPaymentsForUsersCommand {
  constructor(public users: string[]) {}
}

@CommandHandler(GetAllPaymentsForUsersCommand)
export class GetAllPaymentsForUsersUseCase
  implements ICommandHandler<GetAllPaymentsForUsersCommand>
{
  constructor(private paymentsRepository: PaymentsRepository) {}

  async execute(
    command: GetAllPaymentsForUsersCommand,
  ): Promise<PaymentsEntity[]> {
    return this.paymentsRepository.getAllPaymentForUsers(command.users);
  }
}
