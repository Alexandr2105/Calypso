import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma-service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { QueryHelper } from '../../../../../libraries/helpers/query.helper';

@Injectable()
export class QueryRepository {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    @Inject('FILES_SERVICE_TCP') private clientTCP: ClientProxy,
    private queryHelper: QueryHelper,
  ) {}

  // async getPostsAndPhotos(userId: string, queryParam) {
  //   const totalCount = await this.prisma.post.count({
  //     where: { userId: userId },
  //   });
  //   const posts = await this.prisma.post.findMany({
  //     where: { userId: userId },
  //     orderBy: { [queryParam.sortBy]: queryParam.sortDirection },
  //     skip: this.queryHelper.skipHelper(
  //       queryParam.pageNumber,
  //       queryParam.pageSize,
  //     ),
  //     take: queryParam.pageSize,
  //   });
  //   return {
  //     pagesCount: this.queryHelper.pagesCountHelper(
  //       totalCount,
  //       queryParam.pageSize,
  //     ),
  //     page: queryParam.pageNumber,
  //     pageSize: queryParam.pageSize,
  //     totalCount: totalCount,
  //     items: await Promise.all(
  //       posts.map(async (post) => {
  //         const pattern = { cmd: 'getImages' };
  //         const imagesUrls = await firstValueFrom(
  //           this.clientTCP.send(pattern, post.id),
  //         );
  //         return {
  //           id: post.id,
  //           userId: post.userId,
  //           description: post.description,
  //           createdAt: post.createdAt,
  //           images: imagesUrls,
  //         };
  //       }),
  //     ),
  //   };
  // }

  async getPostsAndPhotos(userId: string, postId: string, queryParam) {
    const totalCount = await this.prisma.post.count({
      where: { userId: userId },
    });

    let cursorOptions;
    if (postId !== '0') {
      cursorOptions = { cursor: { id: postId } };
    }

    const posts = await this.prisma.post.findMany({
      where: { userId: userId },
      ...cursorOptions,
      orderBy: { [queryParam.sortBy]: queryParam.sortDirection },
      skip: postId === '0' ? 0 : 1,
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
      items: await Promise.all(
        posts.map(async (post) => {
          const pattern = { cmd: 'getImages' };
          const imagesUrls = await firstValueFrom(
            this.clientTCP.send(pattern, post.id),
          );
          return {
            id: post.id,
            userId: post.userId,
            description: post.description,
            createdAt: post.createdAt,
            images: imagesUrls,
          };
        }),
      ),
    };
  }
}
