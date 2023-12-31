import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';
import { RefreshTokenDataEntity } from '../entities/refresh.token.data.entity';

Injectable();
export class DevicesRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async getInfoAboutDeviceUser(userId: string, deviceId: string) {
    return this.prisma.refreshTokenData.findFirst({
      where: { userId: userId, deviceId: deviceId },
    });
  }

  async delDevice(deviceId: string): Promise<void> {
    await this.prisma.refreshTokenData.delete({
      where: { deviceId: deviceId },
    });
  }

  async saveInfoRefreshToken(info: RefreshTokenDataEntity) {
    await this.prisma.refreshTokenData.upsert({
      where: { deviceId: info.deviceId },
      create: info,
      update: info,
    });
  }

  async delOldRefreshTokenData(date: number) {
    await this.prisma.refreshTokenData.deleteMany({
      where: { exp: { lt: Math.floor(date / 1000) } },
    });
  }

  async updateInfoRefreshTokenData(info: RefreshTokenDataEntity) {
    await this.prisma.refreshTokenData.update({
      where: { deviceId: info.deviceId },
      data: { iat: info.iat, exp: info.exp },
    });
  }

  async getInfoAboutCurrentUserDevices(
    userId: string,
  ): Promise<RefreshTokenDataEntity[]> {
    return this.prisma.refreshTokenData.findMany({ where: { userId: userId } });
  }

  async getInfoAboutDevice(deviceId: string): Promise<RefreshTokenDataEntity> {
    return this.prisma.refreshTokenData.findUnique({
      where: { deviceId: deviceId },
    });
  }

  async deleteDevice(deviceId: string): Promise<void> {
    await this.prisma.refreshTokenData.delete({
      where: { deviceId: deviceId },
    });
  }

  async deleteAllDevicesExceptTheCurrentDevice(
    deviceId: string,
    uerId: string,
  ) {
    await this.prisma.refreshTokenData.deleteMany({
      where: { userId: uerId, NOT: { deviceId: deviceId } },
    });
  }
}
