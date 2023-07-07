import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';
import { PostsEntity } from '../entities/posts.entity';

@Injectable()
export class PostsRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async createNewPost(post: PostsEntity): Promise<PostsEntity> {
    return this.prisma.post.create({ data: post });
  }

  async getPost(postId: string) {
    return this.prisma.post.findUnique({
      where: { id: postId },
      include: { image: { select: { url: true } } },
    });
  }
}
