import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma-service/prisma-service';
import { UserEntity } from '../entities/user.entity';
import { ConfirmationInfoEntity } from '../entities/confirmation-info.entity';

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

  // async refreshConfirmationCodeAndDate(
  //   email: string,
  //   newConfirmationData: { confirmationCode: string; expirationDate: Date },
  // ) {
  //   const account = await this.getAccountWithEmailConfirmationByEmail(email);
  //
  //   await this.emailRepo.save({
  //     confirmationCode: newConfirmationData.confirmationCode,
  //     expirationDate: newConfirmationData.expirationDate,
  //     userId: account.id,
  //   });
  // }

  // async changePassword(newPasswordHash: string, userId: string) {
  //   await this.usersRepo
  //     .createQueryBuilder()
  //     .update(User)
  //     .set({ passwordHash: newPasswordHash })
  //     .where('id = :userId', { userId })
  //     .execute();
  // }
  async getConfirmationInfoByCode(
    code: string,
  ): Promise<ConfirmationInfoEntity> {
    return this.prisma.emailConfirmation.findUnique({
      where: { confirmationCode: code },
    });
  }

  async confirmationEmail(code: string): Promise<void> {
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
      data: { confirmationCode: newConfirmationCode, expirationDate: expDate },
    });
  }

  async getUserByLoginOrEmail(loginOrEmail: string): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
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

    return user;
  }
}
