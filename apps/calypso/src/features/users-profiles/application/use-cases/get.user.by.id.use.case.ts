import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UsersProfilesRepository } from '../../infrastructure/users.profiles.repository';

export class GetUserByIdCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetUserByIdCommand)
export class GetUserByIdUseCase implements ICommandHandler<GetUserByIdCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private usersProfilesRepository: UsersProfilesRepository,
  ) {}

  async execute(command: GetUserByIdCommand) {
    const profile = await this.usersProfilesRepository.getProfile(
      command.userId,
    );
    if (profile) {
      return { id: profile.userId, login: profile.login };
    } else {
      return await this.usersRepository.getUserById(command.userId);
    }
  }
}
