import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegistrationConformationDto } from '../dto/registration-confirmation.dto';
import { EmailDto } from '../dto/email.dto';
import { EmailResendingDto } from '../dto/email-resending.dto';
import { NewPasswordDto } from '../dto/new-password.dto';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
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
import { UserEntity } from '../../users/entities/user.entity';
import { OauthUserInfoDto } from '../dto/oauth.user.info.dto';
import { CreateUserOauth20Command } from '../application/use-cases/create.user.oauth20.use.case';
import { OAuth2ForGoogleCommand } from '../application/use-cases/oauth2.for.google.use.case';
import { ConfirmationInfoEntity } from '../../users/entities/confirmation-info.entity';
import { MergeGoogleAccountCommand } from '../application/use-cases/merge.google.account.use.case';
import { OauthCodeDto } from '../dto/oauth.code.dto';
import { OAuth2ForGithubCommand } from '../application/use-cases/oauth2ForGithubUseCase';
import { MergeGithubAccountCommand } from '../application/use-cases/merge.github.account.use.case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private userRepo: UsersRepository,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Registration users' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Email confirmation link sent')
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'List of possible errors:<br>1.User with this email is already registered<br> ' +
      '2.Wrong length\n',
  )
  async registrationUsers(@Body() body: CreateUserDto): Promise<void> {
    // res.status(204).json({});
    await this.commandBus.execute(new RegistrationUserCommand(body));
  }

  @Get('email-confirmation/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Email confirmation' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Email successfully verified')
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Incorrect confirmation code')
  async registrationConfirmation(
    @Param() params: RegistrationConformationDto,
  ): Promise<void> {
    await this.commandBus.execute(new ConfirmationEmailCommand(params.code));
    return;
  }

  @Post('refresh-link')
  // @UseGuards(IpRestrictionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Refresh confirmation link' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Link updated')
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'List of possible errors:<br>1.Bad request<br>2.Invalid email',
  )
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
  @Post('login')
  @ApiOperation({ summary: 'User authorization' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'Access token for authentication.',
        },
        profile: {
          type: 'boolean',
          description: 'Indicates if a profile exists.',
        },
      },
    },
  })
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  async loginUser(@Body() body: EmailDto, @Res() res, @Req() req) {
    const { accessToken, refreshToken, info } = await this.commandBus.execute(
      new CreateAccessAndRefreshTokensCommand(
        req.user.id,
        randomUUID(),
        req.ip,
        req.headers['user-agent'],
      ),
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
      // domain: '.vercel.com',
    });

    res.send({ ...accessToken, profile: info });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  @ApiOperation({ summary: 'Password recovery' })
  @ApiResponseForSwagger(
    HttpStatus.NO_CONTENT,
    "Even if the current email address is not registered (to prevent the user's email from being detected)",
  )
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Invalid email address')
  async passwordRecovery(@Body() body: EmailResendingDto) {
    await this.commandBus.execute(
      new SendPasswordRecoveryLinkCommand(body.email),
    );

    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  @ApiOperation({ summary: 'Creating a new password' })
  @ApiResponseForSwagger(
    HttpStatus.NO_CONTENT,
    'If the code is valid and the new password is accepted',
  )
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'List of possible errors:<br>1.Wrong length newPassword<br> 2.Incorrect confirmation code',
  })
  async createNewPassword(
    @Body() body: NewPasswordDto,
    // @Recaptcha() recaptchaToken,
  ) {
    await this.commandBus.execute(
      new ChangePasswordCommand(body.recoveryCode, body.newPassword),
    );

    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiResponseForSwagger(
    HttpStatus.UNAUTHORIZED,
    'The JWT refreshToken inside cookie is missing, expired or incorrect',
  )
  @UseGuards(RefreshAuthGuard)
  async logout(@Req() req) {
    await this.commandBus.execute(new LogoutUserCommand(req.user.deviceId));

    return true;
  }

  @ApiOperation({ summary: 'Generate new pair of access and refresh tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Returns JWT accessToken in body and JWT refreshToken in cookie ',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'Access token for authentication.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'The JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshAuthGuard)
  @Post('refresh-token')
  async updateRefreshToken(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new CreateAccessAndRefreshTokensCommand(
        req.user.userId,
        req.user.deviceId,
        req.ip,
        req.headers['user-agent'],
      ),
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
      // domain: '.vercel.com',
      // sameSite: 'None',
    });
    res.send(accessToken);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Returns user data' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserEntity,
  })
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getInfoAboutMe(@Req() req) {
    const user = await this.userRepo.getUserById(req.user.id);
    if (user) return user;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google OAuth registration and login' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'Access token for authentication.',
        },
        profile: {
          type: 'boolean',
          description: 'Indicates if a profile exists.',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Email sent' })
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Bad auth code')
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
        httpOnly: false,
        secure: false,
      });

      res.send({ ...accessToken, profile: info });
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'Access token for authentication.',
        },
        profile: {
          type: 'boolean',
          description: 'Indicates if a profile exists.',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Merge accounts for google' })
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Incorrect confirmation code')
  @Post('merge/google')
  async mergeAccountsForGoogle(
    @Body() body: RegistrationConformationDto,
    @Req() req,
    @Res() res,
  ) {
    if (body.status) {
      const infoUser: ConfirmationInfoEntity = await this.commandBus.execute(
        new ConfirmationEmailCommand(body.code),
      );
      await this.commandBus.execute(
        new MergeGoogleAccountCommand(infoUser.userId),
      );
      const { accessToken, refreshToken, info } = await this.commandBus.execute(
        new CreateAccessAndRefreshTokensCommand(
          infoUser.userId,
          randomUUID(),
          req.ip,
          req.headers['user-agent'],
        ),
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
        secure: false,
      });

      res.send({ ...accessToken, profile: info });
    } else {
      await this.commandBus.execute(new ConfirmationEmailCommand(body.code));
    }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Github OAuth registration and login' })
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'Access token for authentication.',
        },
        profile: {
          type: 'boolean',
          description: 'Indicates if a profile exists.',
        },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Email sent' })
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'List of possible errors:<br>1.Bad auth code<br> 2.Bad verification code' +
      '<br> 3. Email not specified or private',
  )
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
        httpOnly: false,
        secure: false,
      });

      res.send({ ...accessToken, profile: info });
    } else {
      res.sendStatus(HttpStatus.NO_CONTENT);
    }
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          description: 'Access token for authentication.',
        },
        profile: {
          type: 'boolean',
          description: 'Indicates if a profile exists.',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Merge accounts for github' })
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Incorrect confirmation code')
  @Post('merge/github')
  async mergeAccountsForGithub(
    @Body() body: RegistrationConformationDto,
    @Req() req,
    @Res() res,
  ) {
    if (body.status) {
      const infoUser: ConfirmationInfoEntity = await this.commandBus.execute(
        new ConfirmationEmailCommand(body.code),
      );
      await this.commandBus.execute(
        new MergeGithubAccountCommand(infoUser.userId),
      );
      const { accessToken, refreshToken, info } = await this.commandBus.execute(
        new CreateAccessAndRefreshTokensCommand(
          infoUser.userId,
          randomUUID(),
          req.ip,
          req.headers['user-agent'],
        ),
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
        secure: false,
      });

      res.send({ ...accessToken, profile: info });
    } else {
      await this.commandBus.execute(new ConfirmationEmailCommand(body.code));
    }
  }

  // @Get('callback/google')
  // async getGoogleCode() {
  //   console.log('code');
  // }
  //
  // @Get('callback/github')
  // async getGithubCode() {
  //   console.log('code');
  // }
}
