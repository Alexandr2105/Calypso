import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma-service';

@Controller('delete-all-data')
export class TestingController {
  constructor(private readonly prisma: PrismaService) {}
  @Delete()
  @HttpCode(204)
  async clearAllData(): Promise<HttpStatus> {
    await this.prisma.refreshTokenData.deleteMany();

    await this.prisma.emailConfirmation.deleteMany();

    await this.prisma.userProfile.deleteMany();

    await this.prisma.user.deleteMany();

    return;
  }
}
