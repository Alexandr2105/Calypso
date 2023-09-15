import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { ClientProxy } from '@nestjs/microservices';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { Inject } from '@nestjs/common';

export class DeleteUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
    @Inject('FILES_SERVICE_TCP') private clientTCP: ClientProxy,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const pattern = { cmd: 'deleteUser' };
    this.clientTCP.emit(pattern, command.userId);
    await this.usersRepository.deleteUser(command.userId);
  }
}
