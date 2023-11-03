import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserModel } from '../../api/models/user.model';
import { UsersRepositoryGraphql } from '../../infrastructure/users.repository.graphql';
import { NotFoundException } from '@nestjs/common';

export class GetUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetUserCommand)
export class GetUserUseCase implements ICommandHandler<GetUserCommand> {
  constructor(private usersRepositoryGraphql: UsersRepositoryGraphql) {}

  async execute(command: GetUserCommand): Promise<UserModel> {
    const user = await this.usersRepositoryGraphql.getUser(command.userId);
    if (!user) throw new NotFoundException();
    return user;
  }
}
