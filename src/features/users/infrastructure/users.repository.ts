import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma-service/prisma-service';
import { UserEntity } from '../entities/user.entity';
import { ConfirmationInfoEntity } from '../entities/confirmation-info.entity';

//TODO:вот это надо обсудить

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}
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

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserEntity> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            login: loginOrEmail,
          },
          {
            email: loginOrEmail,
          },
        ],
      },
    });
  }

  // async getUserByRecoveryCode(recoveryCode: string) {
  //   return this.prisma.user.findFirst({
  //     where: { emailConfirmation: { confirmationCode: recoveryCode } },
  //     include: { emailConfirmation: true },
  //   });
  // }

  async changePassword(userId: string, newPasswordHash: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });
  }
}
