import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GoogleUserInfoDto } from '../../dto/google.user.info.dto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { UserEntity } from '../../../users/entities/user.entity';

export class CreateUserOauth20Command {
  constructor(public userInfo: GoogleUserInfoDto) {}
}

@CommandHandler(CreateUserOauth20Command)
export class CreateUserOauth20UseCase
  implements ICommandHandler<CreateUserOauth20Command>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: CreateUserOauth20Command) {
    const userInfo: UserEntity = await this.usersRepository.getUserByEmail(
      command.userInfo.email,
    );
    if (!userInfo) {
    } else {
    }
  }
}
