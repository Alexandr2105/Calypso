import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { settings } from '../../../../settings';
import axios from 'axios';
import { Jwt } from '../../../../common/jwt/jwt';
import { GoogleUserInfoDto } from '../../dto/google.user.info.dto';
import { BadRequestException } from '@nestjs/common';

export class OAuth2ForGoogleCommand {
  constructor(public code: string) {}
}

@CommandHandler(OAuth2ForGoogleCommand)
export class OAuth2ForGoogleUseCase
  implements ICommandHandler<OAuth2ForGoogleCommand>
{
  constructor(private jwt: Jwt) {}

  async execute(
    command: OAuth2ForGoogleCommand,
  ): Promise<Promise<GoogleUserInfoDto> | false> {
    const data = {
      code: command.code,
      client_id: settings.GOOGLE_ID,
      client_secret: settings.GOOGLE_SECRET,
      redirect_uri: settings.GOOGLE_REDIRECT_URL,
      grant_type: 'authorization_code',
    };
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const oauthClient: any = await axios.post(tokenUrl, data).catch(() => {
      throw new BadRequestException([
        { message: 'bad auth code', field: 'code' },
      ]);
    });
    const token = oauthClient.data.id_token;
    const userInfo: any = this.jwt.decodeUserByToken(token);
    return {
      email: userInfo.email,
      avatar: userInfo.picture,
      login: userInfo.name,
    };
  }
}
