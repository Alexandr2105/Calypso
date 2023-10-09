import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma-service';
import { UpdateUserStatusDto } from '../api/dto/update.user.status.dto';

@Injectable()
export class UsersRepositoryGraphql {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getUser(id: string) {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  async updateUserStatus(args: UpdateUserStatusDto) {
    return this.prisma.user.update({
      where: { id: args.userId },
      data: { ban: args.banStatus },
    });
  }
}
