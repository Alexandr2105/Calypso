import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserStatusDto } from '../../api/dto/update.user.status.dto';
import { UsersRepositoryGraphql } from '../../infrastructure/users.repository.graphql';

export class UpdateUserStatusCommand {
  constructor(public args: UpdateUserStatusDto) {}
}

@CommandHandler(UpdateUserStatusCommand)
export class UpdateUserStatusUseCase
  implements ICommandHandler<UpdateUserStatusCommand>
{
  constructor(private user: UsersRepositoryGraphql) {}

  async execute(command: UpdateUserStatusCommand) {
    await this.user.updateUserStatus(command.args);
  }
}
