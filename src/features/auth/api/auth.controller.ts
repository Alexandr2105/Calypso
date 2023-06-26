import {
  Body,
  Controller,
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  // constructor(private commandBus: CommandBus) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Registration users' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Email confirmation link sent')
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'Validation error or user already registered',
  )
  async registrationUsers(@Body() body: CreateUserDto): Promise<void> {
    // const registrationUserAndReturnUserId = await this.commandBus.execute(
    //   new RegistrationUserCommand(body),
    // );
    //
    // const createConfirmationInfoAndReturnConfirmationCode =
    //   await this.commandBus.execute(
    //     new CreateConfirmationInfoForUserCommand(
    //       registrationUserAndReturnUserId,
    //     ),
    //   );
    //
    // await this.commandBus.execute(
    //   new SendConfirmationLinkCommand(
    //     body.email,
    //     createConfirmationInfoAndReturnConfirmationCode,
    //   ),
    // );
  }

  @HttpCode(200)
  @Post('email-confirmation/:code')
  @ApiOperation({ summary: 'Email confirmation' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Email successfully verified')
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Link is invalid or expired')
  async registrationConfirmation(@Param() code: RegistrationConformationDto) {
    return code;
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
    return {
      accessToken: 'string',
    };
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
    return true;
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
