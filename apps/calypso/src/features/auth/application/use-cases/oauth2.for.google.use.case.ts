import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import axios from 'axios';
import { Jwt } from '../../../../common/jwt/jwt';
import { OauthUserInfoDto } from '../../dto/oauth.user.info.dto';
import { BadRequestException } from '@nestjs/common';
import { ApiConfigService } from '../../../../common/helpers/api.config.service';

export class OAuth2ForGoogleCommand {
  constructor(public code: string) {}
}

@CommandHandler(OAuth2ForGoogleCommand)
export class OAuth2ForGoogleUseCase
  implements ICommandHandler<OAuth2ForGoogleCommand>
{
  constructor(private jwt: Jwt, private apiConfigService: ApiConfigService) {}

  async execute(
    command: OAuth2ForGoogleCommand,
  ): Promise<Promise<OauthUserInfoDto> | false> {
    const data = {
      code: command.code,
      client_id: this.apiConfigService.googleId,
      client_secret: this.apiConfigService.googleSecret,
      redirect_uri: this.apiConfigService.googleRedirectUrl,
      grant_type: 'authorization_code',
    };
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const oauthClient: any = await axios.post(tokenUrl, data).catch(() => {
      throw new BadRequestException([
        { message: 'Bad auth code', field: 'code' },
      ]);
    });
    const token = oauthClient.data.id_token;
    const userInfo: any = this.jwt.decodeUserByToken(token);
    console.log(userInfo.data);
    console.log('-----------------');
    return {
      userId: userInfo.sub,
      email: userInfo.email,
      avatar: userInfo.picture,
      login: userInfo.name,
    };
  }
}
