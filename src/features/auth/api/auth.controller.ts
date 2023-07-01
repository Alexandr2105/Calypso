import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegistrationConformationDto } from '../dto/registration-confirmation.dto';
import { LoginDto } from '../dto/login.dto';
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
import { SaveInfoAboutDevicesUserCommand } from '../../devices/application/use-cases/save.info.about.devices.user.use.case';
import { UpdateInfoAboutDevicesUserCommand } from '../../devices/application/use-cases/update.info.about.devices.user.use.case';
import { randomUUID } from 'crypto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Registration users' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Email confirmation link sent')
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'Validation error or user already registered',
  )
  async registrationUsers(@Body() body: CreateUserDto): Promise<void> {
    // res.status(204).json({});
    await this.commandBus.execute(new RegistrationUserCommand(body));
  }

  @Get('email-confirmation/:code')
  @Redirect('https://kusto-gamma.vercel.app/login')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Email confirmation' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Email successfully verified')
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Link is invalid or expired')
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
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
  @ApiOperation({ summary: 'user authorization' })
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
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'Validation error or user already registered',
  )
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Invalid credentials')
  async loginUser(@Body() body: LoginDto, @Res() res, @Req() req) {
    const { accessToken, refreshToken, info } = await this.commandBus.execute(
      new CreateAccessAndRefreshTokensCommand(req.user.id, randomUUID()),
    );

    await this.commandBus.execute(
      new SaveInfoAboutDevicesUserCommand(
        refreshToken,
        req.ip,
        req.headers['user-agent'],
      ),
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
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
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'If not valid email (for example, 222^gmail.com)',
  )
  async passwordRecovery(@Body() body: EmailResendingDto) {
    await this.commandBus.execute(
      new SendPasswordRecoveryLinkCommand(body.email),
    );

    return;
  }

  @HttpCode(HttpStatus.OK)
  @Post('new-password')
  @ApiOperation({ summary: 'Creating a new password' })
  @ApiResponseForSwagger(
    HttpStatus.NO_CONTENT,
    'If the code is valid and the new password is accepted',
  )
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'If the input data has incorrect values (due to incorrect password length) or the RecoveryCode is incorrect or expired',
  })
  async createNewPassword(@Body() body: NewPasswordDto) {
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'If the input data has incorrect values (due to incorrect password length) or the RecoveryCode is incorrect or expired',
  })
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
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'If the JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshAuthGuard)
  @Post('refresh-token')
  async updateRefreshToken(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new CreateAccessAndRefreshTokensCommand(
        req.user.userId,
        req.user.deviceId,
      ),
    );
    await this.commandBus.execute(
      new UpdateInfoAboutDevicesUserCommand(
        refreshToken,
        req.ip,
        req.headers['user-agent'],
      ),
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
    });
    res.send(accessToken);
  }
}
