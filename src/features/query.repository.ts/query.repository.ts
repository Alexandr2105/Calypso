import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma-service';

@Injectable()
export class QueryRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async getPostsAndPhotos(userId: string) {
    // const totalCount = await this.prisma.post.count({
    //   where: { userId: userId },
    // });
    return this.prisma.post.findFirstOrThrow({
      where: { userId: userId },
      include: { image: { select: { url: true } } },
      take: 9,
      skip: 0,
      orderBy: { createdAt: 'desc' },
    });
  }
}
