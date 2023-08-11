import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class MergeGithubAccountCommand {
  constructor(public userId: string) {}
}

@CommandHandler(MergeGithubAccountCommand)
export class MergeGithubAccountUseCase
  implements ICommandHandler<MergeGithubAccountCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: MergeGithubAccountCommand): Promise<any> {
    await this.usersRepository.updateStatusForMergeGithub(command.userId);
  }
}
