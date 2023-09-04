import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';

@Injectable()
export class PaymentsRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async getProductById(id: string) {
    return this.prisma.products.findUnique({ where: { idProduct: id } });
  }
}
