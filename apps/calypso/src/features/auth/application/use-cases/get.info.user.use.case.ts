import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class GetInfoUserCommand {
  constructor(public email: string) {}
}

@CommandHandler(GetInfoUserCommand)
export class GetInfoUserUseCase implements ICommandHandler<GetInfoUserCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: GetInfoUserCommand): Promise<any> {
    return this.usersRepository.getUserByEmailForOAuth(command.email);
  }
}
