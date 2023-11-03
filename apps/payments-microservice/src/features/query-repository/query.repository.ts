import { Inject, Injectable } from '@nestjs/common';
import { QueryHelper } from '../../../../../libraries/helpers/query.helper';
import { PaymentsQueryType } from '../../common/query-types/payments.query.type';
import { PrismaService } from '../../common/prisma/prisma-service';
import { PaginationDto } from '../../../../calypso/src/super-admin/api/dto/pagination.dto';

@Injectable()
export class QueryRepository {
  constructor(
    @Inject(PrismaService) private prisma: PrismaService,
    private queryHelper: QueryHelper,
  ) {}

  async getPaymentsCurrentUser(
    userId: string,
    queryParam,
  ): Promise<PaymentsQueryType> {
    const totalCount = await this.prisma.payments.count({
      where: { userId: userId, paymentStatus: 'Success' },
    });
    const payments = await this.prisma.payments.findMany({
      where: { userId: userId, paymentStatus: 'Success' },
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
      items: payments.map((p) => {
        return {
          dateOfPayments: p.createdAt,
          endDateOfSubscription: p.endDateOfSubscription,
          price: p.price,
          subscriptionType: p.subscriptionType,
          paymentType: p.paymentSystem,
        };
      }),
    };
  }

  async getAllPayments(data: PaginationDto) {
    return this.prisma.payments.findMany({
      orderBy: { [data.sortBy]: data.sortDirection },
      skip: this.queryHelper.skipHelper(data.pageNumber, data.pageSize),
      take: data.pageSize,
    });
  }
}
