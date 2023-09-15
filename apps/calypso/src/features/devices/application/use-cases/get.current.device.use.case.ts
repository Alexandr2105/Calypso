import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenType } from '../../../../common/types/refresh.token.type';
import { DevicesRepository } from '../../infrastructure/devices.repository';

export class GetCurrentDeviceCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(GetCurrentDeviceCommand)
export class GetCurrentDeviceUseCase
  implements ICommandHandler<GetCurrentDeviceCommand>
{
  constructor(private devicesRepository: DevicesRepository) {}

  async execute(command: GetCurrentDeviceCommand): Promise<RefreshTokenType> {
    const device = await this.devicesRepository.getInfoAboutDevice(
      command.deviceId,
    );
    return {
      deviceId: device.deviceId,
      deviceName: device.deviceName,
      userId: device.userId,
      ip: device.ip,
      dateCreate: device.dateCreate,
    };
  }
}
