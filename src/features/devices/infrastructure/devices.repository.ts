import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma-service/prisma-service';
import { RefreshTokenDataEntity } from '../entities/refresh.token.data.entity';

Injectable();
export class DevicesRepository {
  constructor(private prisma: PrismaService) {}

  async getInfoAboutDeviceUser(userId: string, deviceId: string) {
    const devicesInfo = await this.prisma.refreshTokenData.findFirst({
      where: { userId: userId, deviceId: deviceId },
    });
    console.log(devicesInfo);
    return devicesInfo;
  }

  async delDevice(deviceId: string): Promise<boolean> {
    const a = await this.prisma.refreshTokenData.delete({
      where: { deviceId: deviceId },
    });
    console.log(a);
    return true;
  }

  async saveInfoRefreshToken(info: RefreshTokenDataEntity) {
    const a = await this.prisma.refreshTokenData.create({ data: info });
    console.log(a);
    return a;
  }

  async delOldRefreshTokenData(date: number) {
    await this.prisma.refreshTokenData.deleteMany({
      where: { exp: { lt: date / 1000 } },
    });
  }
}
