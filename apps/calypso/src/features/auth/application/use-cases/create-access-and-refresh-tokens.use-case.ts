import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Jwt } from '../../../../common/jwt/jwt';
import { UsersProfilesRepository } from '../../../users-profiles/infrastructure/users.profiles.repository';
import { SaveInfoAboutDevicesUserCommand } from '../../../devices/application/use-cases/save.info.about.devices.user.use.case';
import { UpdateInfoAboutDevicesUserCommand } from '../../../devices/application/use-cases/update.info.about.devices.user.use.case';

export class CreateAccessAndRefreshTokensCommand {
  constructor(
    public userId: string,
    public deviceId: string,
    public ip: string,
    public deviceName: string,
  ) {}
}
@CommandHandler(CreateAccessAndRefreshTokensCommand)
export class CreateAccessAndRefreshTokensUseCase
  implements ICommandHandler<CreateAccessAndRefreshTokensCommand>
{
  constructor(
    private jwtService: Jwt,
    private profileRepo: UsersProfilesRepository,
    private commandBus: CommandBus,
  ) {}

  async execute(command: CreateAccessAndRefreshTokensCommand): Promise<object> {
    const accessToken = this.jwtService.creatJWT(command.userId);
    const refreshToken = this.jwtService.creatRefreshJWT(
      command.userId,
      command.deviceId,
    );
    const profile = await this.profileRepo.getProfile(command.userId);

    await this.commandBus.execute(
      new SaveInfoAboutDevicesUserCommand(
        refreshToken,
        command.ip,
        command.deviceName,
      ),
    );

    // await this.commandBus.execute(
    //   new UpdateInfoAboutDevicesUserCommand(
    //     refreshToken,
    //     command.ip,
    //     command.deviceName,
    //   ),
    // );

    return { accessToken, refreshToken, info: profile !== null };
  }
}
