// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { Auth, google } from 'googleapis';
// import { settings } from '../../../../settings';
//
// export class OAuth2ForGoogleCommand {
//   constructor(public code: string) {}
// }
//
// @CommandHandler(OAuth2ForGoogleCommand)
// export class OAuth2ForGoogleUseCase
//   implements ICommandHandler<OAuth2ForGoogleCommand>
// {
//   constructor(private oauthClient: Auth.OAuth2Client) {}
//
//   async execute(command: OAuth2ForGoogleCommand) {
//     this.oauthClient = new google.auth.OAuth2(
//       settings.GOOGLE_ID,
//       settings.GOOGLE_SECRET,
//       settings.GOOGLE_REDIRECT_URL,
//     );
//     console.log(this.oauthClient);
//     const info = await this.oauthClient.getToken(command.code);
//     console.log(info);
//     console.log(info.tokens);
//     const user: Auth.LoginTicket = await this.oauthClient.verifyIdToken({
//       idToken: info.tokens.id_token,
//     });
//     console.log(user);
//     if (!user.getPayload()) {
//       return false;
//     }
//     return {
//       email: user.getPayload().email,
//       avatar_url: user.getPayload().picture,
//       name: user.getPayload().name,
//     };
//   }
// }
