import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
import { LoginForSwaggerType } from '../../../common/types/login.for.swagger.type';
import { UserEntity } from '../../users/entities/user.entity';

export function SwaggerDecoratorByRegistration(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Registration users' }),
    ApiResponseForSwagger(
      HttpStatus.NO_CONTENT,
      'Email confirmation link sent',
    ),
    ApiResponseForSwagger(
      HttpStatus.BAD_REQUEST,
      'List of possible errors:<br>1.User with this email is already registered<br> ' +
        '2.Wrong length\n',
    ),
  );
}

export function SwaggerDecoratorByConfirmationCode(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Email confirmation' }),
    ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Email successfully verified'),
    ApiResponseForSwagger(
      HttpStatus.BAD_REQUEST,
      'Incorrect confirmation code',
    ),
  );
}

export function SwaggerDecoratorByRefreshLink(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh confirmation link' }),
    ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Link updated'),
    ApiResponseForSwagger(
      HttpStatus.BAD_REQUEST,
      'List of possible errors:<br>1.Bad request<br>2.Invalid email',
    ),
  );
}

export function SwaggerDecoratorByLogin(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'User authorization' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: LoginForSwaggerType,
    }),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
  );
}

export function SwaggerDecoratorByPasswordRecovery(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Password recovery' }),
    ApiResponseForSwagger(
      HttpStatus.NO_CONTENT,
      "Even if the current email address is not registered (to prevent the user's email from being detected)",
    ),
    ApiResponseForSwagger(
      HttpStatus.BAD_REQUEST,
      'List of possible errors:<br>1.Invalid email address<br>2.Incorrect recaptcha code',
    ),
  );
}

export function SwaggerDecoratorByNewPassword(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Creating a new password' }),
    ApiResponseForSwagger(
      HttpStatus.NO_CONTENT,
      'If the code is valid and the new password is accepted',
    ),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'List of possible errors:<br>1.Wrong length newPassword<br> 2.Incorrect confirmation code',
    }),
  );
}

export function SwaggerDecoratorByLogout(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'User logout' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
    }),
    ApiResponseForSwagger(
      HttpStatus.UNAUTHORIZED,
      'The JWT refreshToken inside cookie is missing, expired or incorrect',
    ),
  );
}

export function SwaggerDecoratorByRefreshToken(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Generate new pair of access and refresh tokens' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: LoginForSwaggerType,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        'The JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}

export function SwaggerDecoratorByGetInformationMe(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Returns user data' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: UserEntity,
    }),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
    ApiBearerAuth(),
  );
}

export function SwaggerDecoratorByOAuthGoogle(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Google OAuth registration and login' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: LoginForSwaggerType,
    }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Email sent' }),
    ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Bad auth code'),
  );
}

export function SwaggerDecoratorByOAuthGitHub(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Github OAuth registration and login' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: LoginForSwaggerType,
    }),
    ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Email sent' }),
    ApiResponseForSwagger(
      HttpStatus.BAD_REQUEST,
      'List of possible errors:<br>1.Bad auth code<br> 2.Bad verification code',
    ),
  );
}
