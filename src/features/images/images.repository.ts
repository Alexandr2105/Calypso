import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma-service';
import { PostsImagesEntity } from './entities/posts.images.entity';

@Injectable()
export class ImagesRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async createNewImage(image: PostsImagesEntity): Promise<PostsImagesEntity> {
    return this.prisma.postImage.create({ data: image });
  }
}
