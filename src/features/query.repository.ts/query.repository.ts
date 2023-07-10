import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma-service';
import { QueryHelper } from '../../common/helpers/query.helper';

@Injectable()
export class QueryRepository {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    private queryHelper: QueryHelper,
  ) {}

  async getPostsAndPhotos(userId: string, queryParam) {
    const totalCount = await this.prisma.post.count({
      where: { userId: userId },
    });
    const posts = await this.prisma.post.findMany({
      where: { userId: userId },
      include: { images: { select: { url: true } } },
      orderBy: { [queryParam.sortBy]: queryParam.sortDirection },
      skip: this.queryHelper.skipHelper(
        queryParam.pageNumber,
        queryParam.pageSize,
      ),
      take: queryParam.pageSize,
    });
    return {
      pagesCount: this.queryHelper.pagesCountHelper(
        totalCount,
        queryParam.pageSize,
      ),
      page: queryParam.pageNumber,
      pageSize: queryParam.pageSize,
      totalCount: totalCount,
      items: posts,
    };
  }
}
