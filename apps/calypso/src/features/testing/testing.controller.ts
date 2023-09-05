import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma-service';
import { ClientProxy } from '@nestjs/microservices';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('delete-all-data')
export class TestingController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('FILES_SERVICE_TCP') private client: ClientProxy,
  ) {}
  @ApiExcludeEndpoint()
  @Delete()
  @HttpCode(204)
  async clearAllData(): Promise<HttpStatus> {
    await this.prisma.refreshTokenData.deleteMany();

    await this.prisma.emailConfirmation.deleteMany();

    await this.prisma.post.deleteMany();

    await this.prisma.userProfile.deleteMany();

    await this.prisma.user.deleteMany();

    this.client.emit({ cmd: 'deleteAll' }, {});

    return;
  }
}
