import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersProfilesRepository } from '../../infrastructure/users.profiles.repository';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export class DeleteProfileCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileUseCase
  implements ICommandHandler<DeleteProfileCommand>
{
  constructor(
    private usersProfileRepository: UsersProfilesRepository,
    @Inject('FILES_SERVICE_RMQ') private clientRMQ: ClientProxy,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<boolean> {
    const pattern = { cmd: 'deleteProfile' };
    const profile = await this.usersProfileRepository.getProfile(
      command.userId,
    );
    if (!profile) throw new NotFoundException();
    if (profile.userId !== command.userId) throw new ForbiddenException();
    await this.usersProfileRepository.deleteProfile(command.userId);
    await this.clientRMQ.send(pattern, command.userId);
    return true;
  }
}
