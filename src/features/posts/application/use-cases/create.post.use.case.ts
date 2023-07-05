import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { resizePhoto } from '../../../../common/helpers/resize.photo';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { randomUUID } from 'crypto';
import { PostsEntity } from '../../entities/posts.entity';

export class CreatePostCommandBus {
  constructor(
    public photos: Buffer[],
    public description: string,
    public userId: string,
  ) {}
}

@CommandHandler(CreatePostCommandBus)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommandBus>
{
  constructor(
    private fileStorageAdapter: FileStorageAdapterS3,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostCommandBus): Promise<boolean> {
    const post: PostsEntity = await this.postsRepository.createNewPost({
      id: randomUUID(),
      userId: command.userId,
      description: command.description,
    });
    const newPhotoArray: Buffer[] = [];
    for (const a of command.photos) {
      newPhotoArray.push(await resizePhoto(a));
    }
    const key = await this.fileStorageAdapter.saveImagesForPost(
      command.userId,
      newPhotoArray,
      post.id,
    );
    console.log(key);
    return true;
  }
}
