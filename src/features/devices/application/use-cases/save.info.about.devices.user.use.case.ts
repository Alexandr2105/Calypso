import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Jwt } from '../../../../common/jwt/jwt';
import { DevicesRepository } from '../../infrastructure/devices.repository';
import { RefreshTokenDataEntity } from '../../entities/refresh.token.data.entity';
import { PrismaService } from '../../../../common/prisma-service/prisma-service';

export class SaveInfoAboutDevicesUserCommand {
  constructor(
    public refreshToken: string,
    public ip: string,
    public deviceName: string,
  ) {}
}

@CommandHandler(SaveInfoAboutDevicesUserCommand)
export class SaveInfoAboutDevicesUserUseCase
  implements ICommandHandler<SaveInfoAboutDevicesUserCommand>
{
  constructor(
    private jwtService: Jwt,
    private devicesRepository: DevicesRepository,
    private prisma: PrismaService,
  ) {}

  async execute(command: SaveInfoAboutDevicesUserCommand): Promise<any> {
    const infoRefreshToken: any = await this.jwtService.getUserByRefreshToken(
      command.refreshToken,
    );
    const data: RefreshTokenDataEntity = {
      ip: command.ip,
      deviceId: infoRefreshToken.deviceId,
      userId: infoRefreshToken.userId,
      deviceName: command.deviceName,
      iat: infoRefreshToken.iat,
      exp: infoRefreshToken.exp,
    };
    //TODO:надо разобраться чего не работает
    await this.prisma.refreshTokenData.create({ data: data });
    // await this.devicesRepository.saveInfoRefreshToken(data);
    console.log('adsfasdfasdf');
    // await this.devicesRepository.delOldRefreshTokenData(+new Date());
    return;
  }
}
