import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma-service';
import { PaginationUserDto } from '../api/dto/pagination.user.dto';
import { QueryHelper } from '../../../../../libraries/helpers/query.helper';
import { UserModel } from '../api/models/user.model';

@Injectable()
export class QueryRepositoryGraphql {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    private queryHelper: QueryHelper,
  ) {}

  async getUsers(data: PaginationUserDto): Promise<UserModel[]> {
    return this.prisma.user.findMany({
      where: {
        login: { mode: 'insensitive', contains: data.searchName },
      },
      orderBy: { [data.sortBy]: data.sortDirection },
      skip: this.queryHelper.skipHelper(data.pageNumber, data.pageSize),
      take: data.pageSize,
    });
  }

  async getTotalCountUsers(data: PaginationUserDto): Promise<number> {
    return this.prisma.user.count({
      where: {
        login: { mode: 'insensitive', contains: data.searchName },
      },
    });
  }
}
