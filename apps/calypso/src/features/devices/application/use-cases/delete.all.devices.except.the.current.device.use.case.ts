import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure/devices.repository';

export class DeleteAllDevicesExceptTheCurrentDeviceCommand {
  constructor(public deviceId: string, public userId: string) {}
}

@CommandHandler(DeleteAllDevicesExceptTheCurrentDeviceCommand)
export class DeleteAllDevicesExceptTheCurrentDeviceUseCase
  implements ICommandHandler<DeleteAllDevicesExceptTheCurrentDeviceCommand>
{
  constructor(private devicesRepository: DevicesRepository) {}

  async execute(
    command: DeleteAllDevicesExceptTheCurrentDeviceCommand,
  ): Promise<void> {
    await this.devicesRepository.deleteAllDevicesExceptTheCurrentDevice(
      command.deviceId,
      command.userId,
    );
  }
}
