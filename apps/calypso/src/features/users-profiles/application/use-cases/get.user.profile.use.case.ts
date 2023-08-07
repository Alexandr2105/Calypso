import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersProfilesRepository } from '../../infrastructure/users.profiles.repository';
import { UsersProfilesEntity } from '../../entities/users.profiles.entity';
import { NotFoundException } from '@nestjs/common';

export class GetUserProfileCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetUserProfileCommand)
export class GetUserProfileUseCase
  implements ICommandHandler<GetUserProfileCommand>
{
  constructor(private userProfile: UsersProfilesRepository) {}

  async execute(command: GetUserProfileCommand): Promise<UsersProfilesEntity> {
    const profile = await this.userProfile.getProfile(command.userId);
    if (!profile) throw new NotFoundException();
    return profile;
  }
}
