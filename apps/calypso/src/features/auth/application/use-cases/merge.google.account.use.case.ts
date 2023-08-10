import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class MergeGoogleAccountCommand {
  constructor(public userId: string) {}
}

@CommandHandler(MergeGoogleAccountCommand)
export class MergeGoogleAccountUseCase
  implements ICommandHandler<MergeGoogleAccountCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: MergeGoogleAccountCommand): Promise<any> {
    await this.usersRepository.updateStatusForMergeGoogle(command.userId);
  }
}
