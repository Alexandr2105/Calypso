import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdateDescriptionForPostCommand {
  constructor(public description: string, public postId: string) {}
}

@CommandHandler(UpdateDescriptionForPostCommand)
export class UpdateDescriptionForPostUseCase
  implements ICommandHandler<UpdateDescriptionForPostCommand>
{
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: UpdateDescriptionForPostCommand): Promise<void> {
    await this.postsRepository.updateDescription(
      command.description,
      command.postId,
    );
  }
}
