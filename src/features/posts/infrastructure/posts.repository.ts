import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';
import { PostsEntity } from '../entities/posts.entity';
import { PostsImagesEntity } from '../entities/posts.images.entity';

@Injectable()
export class PostsRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async createNewPost(post: PostsEntity): Promise<PostsEntity> {
    return this.prisma.post.create({ data: post });
  }

  async createNewImage(image: PostsImagesEntity): Promise<PostsImagesEntity> {
    return this.prisma.postImage.create({ data: image });
  }
}
