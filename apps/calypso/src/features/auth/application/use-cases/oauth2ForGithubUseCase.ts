import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import axios from 'axios';
import { BadRequestException } from '@nestjs/common';
import { ApiConfigService } from '../../../../common/helpers/api.config.service';

export class OAuth2ForGithubCommand {
  constructor(public code: string) {}
}

@CommandHandler(OAuth2ForGithubCommand)
export class OAuth2ForGithubUseCase
  implements ICommandHandler<OAuth2ForGithubCommand>
{
  constructor(private apiConfigService: ApiConfigService) {}

  async execute(command: OAuth2ForGithubCommand) {
    const data = {
      code: command.code,
      client_id: this.apiConfigService.githubId,
      client_secret: this.apiConfigService.githubSecret,
      redirect_uri: this.apiConfigService.githubRedirectUrl,
      grant_type: 'authorization_code',
    };
    const tokenUrl = 'https://github.com/login/oauth/access_token';
    const oauthClient: any = await axios.post(tokenUrl, data).catch(() => {
      throw new BadRequestException([
        { message: 'Bad auth code', field: 'code' },
      ]);
    });
    const access_token = oauthClient.data.split('=')[1].split('&')[0];
    const userInfo = await axios
      .get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .catch(() => {
        throw new BadRequestException([
          { message: 'Bad verification code', field: 'accessToken' },
        ]);
      });
    const userEmailsInfo = await axios
      .get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .catch(() => {
        throw new BadRequestException([
          { message: 'Bad verification code', field: 'accessToken' },
        ]);
      });
    return {
      userId: userInfo.data.id.toString(),
      email: userEmailsInfo.data[0].email,
      avatar: userInfo.data.avatar_url,
      login: userInfo.data.login,
    };
  }
}
