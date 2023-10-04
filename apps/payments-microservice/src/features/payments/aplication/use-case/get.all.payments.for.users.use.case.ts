import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsRepository } from '../../infrastructure/payments.repository';
import { PaymentsModel } from '../../../../../../calypso/src/super-admin/api/models/payments.model';

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
  ): Promise<PaymentsModel[]> {
    return this.paymentsRepository.getAllPaymentForUsers(command.users);
  }
}
