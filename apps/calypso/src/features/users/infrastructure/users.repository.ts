import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';
import { UserEntity } from '../entities/user.entity';
import { ConfirmationInfoEntity } from '../entities/confirmation-info.entity';

@Injectable()
export class UsersRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  async saveEmailConfirmation(
    emailConfirmation: ConfirmationInfoEntity,
  ): Promise<string> {
    const emailConf = await this.prisma.emailConfirmation.upsert({
      where: { userId: emailConfirmation.userId },
      create: emailConfirmation,
      update: emailConfirmation,
    });

    return emailConf.confirmationCode;
  }

  async createUser(newUser: UserEntity): Promise<string> {
    const user = await this.prisma.user.create({ data: newUser });
    return user.id;
  }

  async getConfirmationInfoByCode(
    code: string,
  ): Promise<ConfirmationInfoEntity> {
    return this.prisma.emailConfirmation.findUnique({
      where: { confirmationCode: code },
    });
  }

  async updateStatusConfirmationEmail(
    code: string,
  ): Promise<ConfirmationInfoEntity> {
    return this.prisma.emailConfirmation.update({
      where: { confirmationCode: code },
      data: { isConfirmed: true },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { emailConfirmation: true },
    });
  }

  async changePassword(userId: string, newPasswordHash: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  }

  async getUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, login: true },
    });
  }

  async deleteExpirationUser(userId: string) {
    try {
      await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {}
  }

  async deleteExpirationCode(userId: string) {
    try {
      await this.prisma.emailConfirmation.delete({
        where: { userId: userId },
      });
    } catch (error) {}
  }

  async deleteUser(userId: string) {
    await this.prisma.post.deleteMany({
      where: { userId: userId },
    });
    await this.prisma.userProfile.deleteMany({
      where: { userId: userId },
    });
    await this.prisma.refreshTokenData.deleteMany({
      where: { userId: userId },
    });
    await this.prisma.emailConfirmation.deleteMany({
      where: { userId: userId },
    });
    await this.prisma.user.deleteMany({
      where: { id: userId },
    });
  }

  async updateStatusForMergeGoogle(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { googleAuth: true },
    });
  }

  async updateStatusForMergeGithub(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { githubAuth: true },
    });
  }

  async getUserByEmailForOAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
