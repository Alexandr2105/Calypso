import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';
import { UsersProfilesEntity } from '../entities/users.profiles.entity';

@Injectable()
export class UsersProfilesRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async saveUsersProfiles({ userId, ...all }: UsersProfilesEntity) {
    await this.prisma.userProfile.upsert({
      where: { userId: userId },
      create: { userId, ...all },
      update: { ...all },
    });
  }

  async getProfile(userId: string): Promise<UsersProfilesEntity> | null {
    return this.prisma.userProfile.findUnique({
      where: { userId: userId },
    });
  }
}
