import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';
import { Jwt } from '../../../../common/jwt/jwt';

export class CreateAccessAndRefreshTokensCommand {
  constructor(public userId: string) {}
}
@CommandHandler(CreateAccessAndRefreshTokensCommand)
export class CreateAccessAndRefreshTokensUseCase
  implements ICommandHandler<CreateAccessAndRefreshTokensCommand>
{
  constructor(private jwtService: Jwt) {}

  async execute(command: CreateAccessAndRefreshTokensCommand): Promise<object> {
    const accessToken = this.jwtService.creatJWT(command.userId);
    const refreshToken = this.jwtService.creatRefreshJWT(
      command.userId,
      randomUUID(),
    );
    return { accessToken, refreshToken };
  }
}
