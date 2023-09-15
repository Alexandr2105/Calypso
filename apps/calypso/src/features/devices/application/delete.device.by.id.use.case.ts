import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../infrastructure/devices.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteDeviceByIdCommand {
  constructor(public deviceId: string, public userId: string) {}
}

@CommandHandler(DeleteDeviceByIdCommand)
export class DeleteDeviceByIdUseCase
  implements ICommandHandler<DeleteDeviceByIdCommand>
{
  constructor(private devicesRepository: DevicesRepository) {}

  async execute(command: DeleteDeviceByIdCommand): Promise<void> {
    const deviceInfo = await this.devicesRepository.getInfoAboutDevice(
      command.deviceId,
    );
    if (!deviceInfo) throw new NotFoundException();
    if (deviceInfo.userId !== command.userId) throw new ForbiddenException();
    await this.devicesRepository.deleteDevice(command.deviceId);
  }
}
