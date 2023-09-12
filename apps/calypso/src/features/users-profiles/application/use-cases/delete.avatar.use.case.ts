import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersProfilesRepository } from '../../infrastructure/users.profiles.repository';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export class DeleteAvatarCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarUseCase
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(
    private usersProfilesRepository: UsersProfilesRepository,
    @Inject('FILES_SERVICE_TCP') private clientTCP: ClientProxy,
  ) {}

  async execute(command: DeleteAvatarCommand): Promise<void> {
    await this.usersProfilesRepository.deleteAvatar(command.userId);

    const pattern = { cmd: 'deleteAvatar' };
    this.clientTCP.emit(pattern, command.userId);
  }
}
