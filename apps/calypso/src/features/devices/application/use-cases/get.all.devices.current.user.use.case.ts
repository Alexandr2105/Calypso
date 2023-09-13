import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure/devices.repository';
import { RefreshTokenDataEntity } from '../../entities/refresh.token.data.entity';
import { RefreshTokenType } from '../../../../common/types/refresh.token.type';

export class GetAllDevicesCurrentUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GetAllDevicesCurrentUserCommand)
export class GetAllDevicesCurrentUserUseCase
  implements ICommandHandler<GetAllDevicesCurrentUserCommand>
{
  constructor(private devicesRepository: DevicesRepository) {}

  async execute(
    command: GetAllDevicesCurrentUserCommand,
  ): Promise<RefreshTokenType[]> {
    const devicesInfo: RefreshTokenDataEntity[] =
      await this.devicesRepository.getInfoAboutCurrentUserDevices(
        command.userId,
      );
    return devicesInfo.map((m) => {
      return {
        deviceId: m.deviceId,
        deviceName: m.deviceName,
        userId: m.userId,
        ip: m.ip,
        dateCreate: m.dateCreate,
      };
    });
  }
}
