import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { CreateConfirmationInfoForUserCommand } from '../application/use-cases/create-confirmation-info.use-case';
import { SendConfirmationLinkCommand } from '../application/use-cases/send-confirmation-link.use-case';
import { ConfirmationEmailCommand } from '../application/use-cases/confirmation-email.use-case';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { RefreshConfirmationLinkCommand } from '../application/use-cases/refresh-confirmation-link.use-case';

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
    const registrationUserAndReturnUserId = await this.commandBus.execute(
      new RegistrationUserCommand(body),
    );

    const createConfirmationInfoAndReturnConfirmationCode =
      await this.commandBus.execute(
        new CreateConfirmationInfoForUserCommand(
          registrationUserAndReturnUserId,
        ),
      );

    await this.commandBus.execute(
      new SendConfirmationLinkCommand(
        body.email,
        createConfirmationInfoAndReturnConfirmationCode,
      ),
    );
    return;
  }

  @Post('email-confirmation/:code')
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

  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'user authorization' })
  @ApiResponseForSwagger(
    HttpStatus.OK,
    'Successful authorization. While without JWT',
  )
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'Validation error or user already registered',
  )
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Invalid credentials')
  async loginUser(@Body() body: LoginDto) {
    return 'ok';
  }

  @HttpCode(204)
  @Post('password-recovery')
  @ApiOperation({ summary: 'password recovery' })
  @ApiResponseForSwagger(
    HttpStatus.NO_CONTENT,
    "Even if the current email address is not registered (to prevent the user's email from being detected)",
  )
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'If not valid email (for example, 222^gmail.com)',
  )
  async passwordRecovery(@Body() body: EmailResendingDto) {
    return 'ok';
  }

  @HttpCode(204)
  @Post('new-password')
  @ApiOperation({ summary: 'creating a new password' })
  @ApiResponseForSwagger(
    HttpStatus.NO_CONTENT,
    'If the code is valid and the new password is accepted',
  )
  @ApiResponse({
    status: 400,
    description:
      'If the input data has incorrect values (due to incorrect password length) or the RecoveryCode is incorrect or expired',
  })
  async createNewPassword(@Body() body: NewPasswordDto) {
    return 'ok';
  }

  @HttpCode(204)
  @Post('logout')
  @ApiOperation({ summary: 'user logout' })
  @ApiResponse({
    status: 204,
  })
  @ApiResponse({
    status: 400,
    description:
      'If the input data has incorrect values (due to incorrect password length) or the RecoveryCode is incorrect or expired',
  })
  async logout() {
    return true;
  }
}
