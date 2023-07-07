import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma-service';

@Injectable()
export class QueryRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async getPostsAndPhotos(userId: string) {
    return this.prisma.post.findMany({
      where: { userId: userId },
      include: { image: { select: { url: true } } },
      take: 9,
      skip: 0,
      orderBy: { createdAt: 'desc' },
    });
  }
}
