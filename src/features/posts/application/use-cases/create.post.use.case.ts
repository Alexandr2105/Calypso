import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { resizePhoto } from '../../../../common/helpers/resize.photo';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { randomUUID } from 'crypto';
import { PostsEntity } from '../../entities/posts.entity';
import sharp from 'sharp';

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
      createdAt: new Date(),
    });
    const newPhotoArray: Buffer[] = [];
    for (const a of command.photos) {
      newPhotoArray.push(await resizePhoto(a));
    }

    for (const buffer of newPhotoArray) {
      const image = await this.fileStorageAdapter.saveImagesForPost(
        command.userId,
        buffer,
        post.id,
      );
      const imageInfo = await sharp(buffer).metadata();
      await this.postsRepository.createNewImage({
        id: image.id,
        postId: image.postId,
        createdAt: image.createdAt,
        key: image.key,
        bucket: image.bucket,
        url: `https://storage.yandexcloud.net/${image.bucket}/${image.key}`,
        height: imageInfo.height,
        width: imageInfo.width,
        fileSize: imageInfo.size,
      });
    }

    return true;
  }
}
