import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { settings } from '../../../../settings';
import axios from 'axios';
import { BadRequestException } from '@nestjs/common';

export class OAuth2ForGithubCommand {
  constructor(public code: string) {}
}

@CommandHandler(OAuth2ForGithubCommand)
export class OAuth2ForGithubUseCase
  implements ICommandHandler<OAuth2ForGithubCommand>
{
  async execute(command: OAuth2ForGithubCommand) {
    const data = {
      code: command.code,
      client_id: settings.GITHUB_ID,
      client_secret: settings.GITHUB_SECRET,
      redirect_uri: settings.GITHUB_REDIRECT_URL,
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
    if (!userInfo.data.email) {
      throw new BadRequestException([
        { message: 'Email not specified or private', field: 'email' },
      ]);
    }
    return {
      email: userInfo.data.email,
      avatar: userInfo.data.avatar_url,
      login: userInfo.data.login,
    };
  }
}
