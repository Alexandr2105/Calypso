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
    const emailConf = await this.prisma.emailConfirmation.create({
      data: emailConfirmation,
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

  async updateConfirmationEmail(code: string): Promise<void> {
    await this.prisma.emailConfirmation.update({
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

  async refreshConfirmationInfo(
    userId: string,
    newConfirmationCode: `${string}-${string}-${string}-${string}-${string}`,
    expDate: Date,
  ): Promise<void> {
    await this.prisma.emailConfirmation.update({
      where: { userId },
      data: {
        confirmationCode: newConfirmationCode,
        expirationDate: expDate,
        isConfirmed: false,
      },
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
}
