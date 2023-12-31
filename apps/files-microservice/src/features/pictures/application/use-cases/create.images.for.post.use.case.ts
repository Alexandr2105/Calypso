import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { resizePhoto } from '../../../../common/helpers/resize.photo';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { PostsDto } from '../../dto/posts.dto';
import sharp from 'sharp';
import { ImagesRepository } from '../../infrastructure/images.repository';
import { PostImagesDocument } from '../../schemas/post.images.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiConfigService } from '../../../../common/helpers/api.config.service';

export class CreateImagesForPostCommand {
  constructor(public data: PostsDto) {}
}

@CommandHandler(CreateImagesForPostCommand)
export class CreateImagesForPostUseCase
  implements ICommandHandler<CreateImagesForPostCommand>
{
  constructor(
    @InjectModel('postImages') private postImages: Model<PostImagesDocument>,
    private apiConfigService: ApiConfigService,
    private fileStorageAdapter: FileStorageAdapterS3,
    private imageRepository: ImagesRepository,
  ) {}
  async execute(command: CreateImagesForPostCommand): Promise<any> {
    const newPhotoArray: Buffer[] = [];
    for (const a of command.data.arrayImages) {
      newPhotoArray.push(await resizePhoto(a.buffer));
    }

    const imagesArray = [];
    for (const buffer of newPhotoArray) {
      const image = await this.fileStorageAdapter.saveImagesForPost(
        command.data.userId,
        buffer,
        command.data.postId,
      );
      const imageInfo = await sharp(buffer).metadata();
      const postImage: PostImagesDocument = new this.postImages();
      postImage.id = image.id;
      postImage.userId = command.data.userId;
      postImage.postId = image.postId;
      postImage.createdAt = image.createdAt;
      postImage.key = image.key;
      postImage.bucket = image.bucket;
      postImage.url = `${this.apiConfigService.baseUrlAws}/${image.bucket}/${image.key}`;
      postImage.height = imageInfo.height;
      postImage.width = imageInfo.width;
      postImage.fileSize = imageInfo.size;
      await this.imageRepository.createNewImage(postImage);
      imagesArray.push({ url: postImage.url });
    }
    return imagesArray;
  }
}
