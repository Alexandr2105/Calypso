import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { ForbiddenException } from '@nestjs/common';
import { ImagesRepository } from '../../../images/images.repository';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { PostsImagesEntity } from '../../../images/entities/posts.images.entity';

export class DeletePostCommand {
  constructor(public postId: string, public userId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private imagesRepository: ImagesRepository,
    private fileStorage: FileStorageAdapterS3,
  ) {}

  async execute(command: DeletePostCommand): Promise<any> {
    const post = await this.postsRepository.getPostById(command.postId);
    if (post && post.userId !== command.userId) throw new ForbiddenException();
    const images: PostsImagesEntity[] = await this.imagesRepository.getImages(
      post.id,
    );
    await this.imagesRepository.deleteImages(command.postId);
    await this.postsRepository.deletePost(command.postId);
    for (const image of images) {
      await this.fileStorage.deleteImage(image.bucket, image.key);
    }
  }
}
