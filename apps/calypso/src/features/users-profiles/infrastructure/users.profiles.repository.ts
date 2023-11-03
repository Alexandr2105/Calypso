import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';
import { UsersProfilesEntity } from '../entities/users.profiles.entity';

@Injectable()
export class UsersProfilesRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async saveUsersProfiles(info: UsersProfilesEntity) {
    await this.prisma.userProfile.upsert({
      where: { userId: info.userId },
      create: info,
      update: info,
    });
  }

  async updateUsersLogin(userId: string, login: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { login: login },
    });
  }

  async getProfile(userId: string): Promise<UsersProfilesEntity> | null {
    return this.prisma.userProfile.findUnique({
      where: { userId: userId },
    });
  }

  async deleteProfile(userId: string): Promise<void> {
    await this.prisma.userProfile.delete({ where: { userId: userId } });
  }

  async deleteAvatar(userId: string): Promise<void> {
    await this.prisma.userProfile.update({
      where: { userId: userId },
      data: { photo: '' },
    });
  }

  async getAllProfiles(profiles: string[]) {
    return this.prisma.userProfile.findMany({
      where: { userId: { in: profiles } },
    });
  }
}
