import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma-service';

@Injectable()
export class UsersRepositoryGraphql {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getUser(id: string) {
    return this.prisma.user.findUnique({ where: { id: id } });
  }
}
