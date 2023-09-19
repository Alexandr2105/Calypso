import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegistrationConformationDto } from '../dto/registration-confirmation.dto';
import { EmailDto } from '../dto/email.dto';
import { EmailResendingDto } from '../dto/email-resending.dto';
import { NewPasswordDto } from '../dto/new-password.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationUserCommand } from '../application/use-cases/registration-user.use-case';
import { ConfirmationEmailCommand } from '../application/use-cases/confirmation-email.use-case';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { RefreshConfirmationLinkCommand } from '../application/use-cases/refresh-confirmation-link.use-case';
import { SendPasswordRecoveryLinkCommand } from '../application/use-cases/send-password-recovery-link.use-case';
import { ChangePasswordCommand } from '../application/use-cases/change-password.use-case';
import { LocalAuthGuard } from '../../../common/guards/local.auth.guard';
import { CreateAccessAndRefreshTokensCommand } from '../application/use-cases/create-access-and-refresh-tokens.use-case';
import { RefreshAuthGuard } from '../../../common/guards/refresh.auth.guard';
import { LogoutUserCommand } from '../../devices/application/use-cases/logout.user.use.case';
import { randomUUID } from 'crypto';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { OauthUserInfoDto } from '../dto/oauth.user.info.dto';
import { CreateUserOauth20Command } from '../application/use-cases/create.user.oauth20.use.case';
import { OAuth2ForGoogleCommand } from '../application/use-cases/oauth2.for.google.use.case';
import { OauthCodeDto } from '../dto/oauth.code.dto';
import { OAuth2ForGithubCommand } from '../application/use-cases/oauth2ForGithubUseCase';
import {
  SwaggerDecoratorByConfirmationCode,
  SwaggerDecoratorByGetInformationMe,
  SwaggerDecoratorByLogin,
  SwaggerDecoratorByLogout,
  SwaggerDecoratorByNewPassword,
  SwaggerDecoratorByOAuthGitHub,
  SwaggerDecoratorByOAuthGoogle,
  SwaggerDecoratorByPasswordRecovery,
  SwaggerDecoratorByRefreshLink,
  SwaggerDecoratorByRefreshToken,
  SwaggerDecoratorByRegistration,
} from '../swagger/swagger.auth.decorators';
import { RealIP } from 'nestjs-real-ip';
import * as express from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private userRepo: UsersRepository,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDecoratorByRegistration()
  async registrationUsers(
    @Body() body: CreateUserDto,
    @Res() res,
  ): Promise<void> {
    res.status(204).json({});
    await this.commandBus.execute(new RegistrationUserCommand(body));
  }

  @Get('email-confirmation/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDecoratorByConfirmationCode()
  async registrationConfirmation(
    @Param() params: RegistrationConformationDto,
  ): Promise<void> {
    await this.commandBus.execute(new ConfirmationEmailCommand(params.code));
    return;
  }

  @Post('refresh-link')
  // @UseGuards(IpRestrictionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDecoratorByRefreshLink()
  async refreshConfirmationLink(
    @Body() inputModel: RegistrationEmailResendingDto,
  ): Promise<HttpStatus> {
    await this.commandBus.execute(
      new RefreshConfirmationLinkCommand(inputModel.email),
    );

    return;
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @SwaggerDecoratorByLogin()
  @Post('login')
  async loginUser(
    @Body() body: EmailDto,
    @Res() res,
    @Req() req,
    @Ip() ip,
    @RealIP() realIp,
    @Req() request: express.Request,
  ) {
    console.log(req.ip);
    console.log(req);
    console.log('----------------------------');
    console.log(req.ip);
    console.log('+++++++++++++++++++++++++++');
    console.log(req.headers);
    console.log(req.headers['user-agent']);
    console.log(ip);
    console.log('_+_+_+_+_+_+');
    console.log(realIp);
    console.log(request.ip);
    const { accessToken, refreshToken, info } = await this.commandBus.execute(
      new CreateAccessAndRefreshTokensCommand(
        req.user.id,
        randomUUID(),
        req.ip,
        req.headers['user-agent'],
      ),
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      // expires: expirationDate,
      // domain: '.vercel.app',
    });

    res.send({ ...accessToken, profile: info });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDecoratorByPasswordRecovery()
  @Post('password-recovery')
  async passwordRecovery(@Body() body: EmailResendingDto) {
    await this.commandBus.execute(
      new SendPasswordRecoveryLinkCommand(body.email),
    );
    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDecoratorByNewPassword()
  @Post('new-password')
  async createNewPassword(@Body() body: NewPasswordDto) {
    await this.commandBus.execute(
      new ChangePasswordCommand(body.recoveryCode, body.newPassword),
    );

    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDecoratorByLogout()
  @Post('logout')
  @UseGuards(RefreshAuthGuard)
  async logout(@Req() req) {
    await this.commandBus.execute(new LogoutUserCommand(req.user.deviceId));

    return true;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  @SwaggerDecoratorByRefreshToken()
  @Post('refresh-token')
  async updateRefreshToken(@Req() req, @Res() res) {
    const { accessToken, refreshToken, info } = await this.commandBus.execute(
      new CreateAccessAndRefreshTokensCommand(
        req.user.userId,
        req.user.deviceId,
        req.ip,
        req.headers['user-agent'],
      ),
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      // domain: '.vercel.app',
    });
    res.send({ ...accessToken, profile: info });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByGetInformationMe()
  @Get('me')
  async getInfoAboutMe(@Req() req) {
    const user = await this.userRepo.getUserById(req.user.id);
    if (user) return user;
  }

  @HttpCode(HttpStatus.OK)
  @SwaggerDecoratorByOAuthGoogle()
  @Post('google')
  async getAccessTokenForGoogle(
    @Body() body: OauthCodeDto,
    @Req() req,
    @Res() res,
  ) {
    const code = decodeURIComponent(body.code);
    const userInfo: OauthUserInfoDto = await this.commandBus.execute(
      new OAuth2ForGoogleCommand(code),
    );
    const userId = await this.commandBus.execute(
      new CreateUserOauth20Command(userInfo, 'google'),
    );
    if (userId) {
      const { accessToken, refreshToken, info } = await this.commandBus.execute(
        new CreateAccessAndRefreshTokensCommand(
          userId,
          randomUUID(),
          req.ip,
          req.headers['user-agent'],
        ),
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.send({ ...accessToken, profile: info });
    }
  }

  @HttpCode(HttpStatus.OK)
  @SwaggerDecoratorByOAuthGitHub()
  @Post('github')
  async getAccessTokenForGithub(
    @Body() body: OauthCodeDto,
    @Req() req,
    @Res() res,
  ) {
    const code = body.code;
    const userInfo: OauthUserInfoDto = await this.commandBus.execute(
      new OAuth2ForGithubCommand(code),
    );
    const userId = await this.commandBus.execute(
      new CreateUserOauth20Command(userInfo, 'github'),
    );
    if (userId) {
      const { accessToken, refreshToken, info } = await this.commandBus.execute(
        new CreateAccessAndRefreshTokensCommand(
          userId,
          randomUUID(),
          req.ip,
          req.headers['user-agent'],
        ),
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.send({ ...accessToken, profile: info });
    }
    return true;
  }
}
