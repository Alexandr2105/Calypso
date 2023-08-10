import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleUserInfoDto } from '../../dto/google.user.info.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UserEntity } from '../../../users/entities/user.entity';
import { randomUUID } from 'crypto';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';
import { UsersProfilesRepository } from '../../../users-profiles/infrastructure/users.profiles.repository';

export class CreateUserOauth20Command {
  constructor(public userInfo: GoogleUserInfoDto) {}
}

@CommandHandler(CreateUserOauth20Command)
export class CreateUserOauth20UseCase
  implements ICommandHandler<CreateUserOauth20Command>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailAdapter: EmailAdapter,
    private usersProfilesRepository: UsersProfilesRepository,
  ) {}

  async execute(command: CreateUserOauth20Command) {
    const userInfo: UserEntity = await this.usersRepository.getUserByEmail(
      command.userInfo.email,
    );
    if (!userInfo) {
      const userId = randomUUID();
      const createdAt = new Date();

      const newUser: UserEntity = new UserEntity(
        userId,
        command.userInfo.login,
        command.userInfo.email,
        createdAt,
        false,
        true,
        false,
      );
      await this.usersRepository.createUser(newUser);
      await this.emailAdapter.sendEmailGoogleRegistration(
        command.userInfo.email,
      );
      await this.usersProfilesRepository.saveUsersProfiles({
        userId: newUser.id,
        login: newUser.login,
        photo: command.userInfo.avatar,
      });
    } else {
      return false;
    }
  }
}
