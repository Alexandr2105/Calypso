import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserEntity } from '../../../users/entities/user.entity';
import { BcryptService } from '../../../../common/bcript/bcript.service';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

export class RegistrationUserCommand {
  constructor(public body: CreateUserDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  constructor(
    private bcryptService: BcryptService,
    private userRepo: UsersRepository,
  ) {}
  async execute(command: RegistrationUserCommand): Promise<string> {
    const hash = await this.bcryptService.generateHashForNewUser(
      command.body.password,
    );
    const userId = randomUUID();
    const createdAt = new Date();

    const newUser = new UserEntity(
      userId,
      command.body.login,
      command.body.email,
      createdAt,
      hash,
      false,
    );

    await this.userRepo.createUser(newUser);
    return userId;
  }
}
