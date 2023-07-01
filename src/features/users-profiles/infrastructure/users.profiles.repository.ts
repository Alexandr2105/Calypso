import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';

@Injectable()
export class UsersProfilesRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async saveUsersProfiles(usersProfiles) {
    await this.prisma.userProfile.upsert({
      where: { userId: usersProfiles.userId },
      create: { ...usersProfiles },
      update: { ...usersProfiles },
    });
  }
}
