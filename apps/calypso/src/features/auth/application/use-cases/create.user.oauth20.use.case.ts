import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OauthUserInfoDto } from '../../dto/oauth.user.info.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UserEntity } from '../../../users/entities/user.entity';
import { randomUUID } from 'crypto';
import { EmailAdapter } from '../../../../common/SMTP-adapter/email-adapter';
import { UsersProfilesRepository } from '../../../users-profiles/infrastructure/users.profiles.repository';
import { UpdateConfirmationCodeCommand } from './update.confirmation.code.use.case';

export class CreateUserOauth20Command {
  constructor(public userInfo: OauthUserInfoDto, public method: string) {}
}

@CommandHandler(CreateUserOauth20Command)
export class CreateUserOauth20UseCase
  implements ICommandHandler<CreateUserOauth20Command>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailAdapter: EmailAdapter,
    private usersProfilesRepository: UsersProfilesRepository,
    private commandBus: CommandBus,
  ) {}

  async execute(command: CreateUserOauth20Command) {
    const user: UserEntity = await this.usersRepository.getUserByEmail(
      command.userInfo.email,
    );
    if (!user) {
      const userId = randomUUID();
      const createdAt = new Date();

      const newUser: UserEntity = new UserEntity(
        userId,
        command.userInfo.login,
        command.userInfo.email,
        createdAt,
        false,
        command.method === 'google',
        command.method === 'github',
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
      return newUser.id;
    } else {
      const createConfirmationInfoAndReturnConfirmationCode =
        await this.commandBus.execute(
          new UpdateConfirmationCodeCommand(user.id),
        );
      await this.emailAdapter.sendEmailForMergeAccount(
        command.userInfo.email,
        createConfirmationInfoAndReturnConfirmationCode,
      );
      return false;
    }
  }
}
