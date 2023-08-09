import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Auth, google } from 'googleapis';
import { settings } from '../../../../settings';

export class OAuth2ForGoogleCommand {
  constructor(public code: string) {}
}

@CommandHandler(OAuth2ForGoogleCommand)
export class OAuth2ForGoogleUseCase
  implements ICommandHandler<OAuth2ForGoogleCommand>
{
  async execute(command: OAuth2ForGoogleCommand) {
    const oauthClient: Auth.OAuth2Client = new google.auth.OAuth2(
      settings.GOOGLE_ID,
      settings.GOOGLE_SECRET,
      settings.GOOGLE_REDIRECT_URL,
    );
    const info = await oauthClient.getToken(command.code);
    const userInfo: Auth.LoginTicket = await oauthClient.verifyIdToken({
      idToken: info.tokens.id_token,
    });
    if (!userInfo.getPayload()) {
      return false;
    }
    return {
      email: userInfo.getPayload().email,
      avatar_url: userInfo.getPayload().picture,
      name: userInfo.getPayload().name,
    };
  }
}
