import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure/devices.repository';
import { PrismaService } from '../../../../common/prisma-service/prisma-service';

export class LogoutUserCommand {
  constructor(public deviceId: string) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
  constructor(
    private devicesRepository: DevicesRepository,
    private prisma: PrismaService,
  ) {}

  async execute(command: LogoutUserCommand) {
    //TODO:надо разобраться

    await this.prisma.refreshTokenData.delete({
      where: { deviceId: command.deviceId },
    });
    return;
    // return await this.devicesRepository.delDevice(command.deviceId);
  }
}
