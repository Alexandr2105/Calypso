import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersProfilesEntity } from '../entities/users.profiles.entity';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';

export function SwaggerDecoratorByGetProfile(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get user profile' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: UsersProfilesEntity,
    }),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
    ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found'),
  );
}

export function SwaggerDecoratorByPostSaveProfileInfo(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create profile' }),
    ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'User saved'),
    ApiResponseForSwagger(
      HttpStatus.BAD_REQUEST,
      'List of possible errors:<br>1.Wrong length.<br>2.Invalid date format. Please use the format dd-mm-yyyy.',
    ),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
  );
}

export function SwaggerDecoratorByPostSaveAvatar(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Upload avatar. "fieldName" must be "avatar"' }),
    ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Avatar created'),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
  );
}

export function SwaggerDecoratorByDeleteProfile(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete profile' }),
    ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Profile deleted'),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
    ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found'),
  );
}

export function SwaggerDecoratorByDeleteAvatar(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete avatar' }),
    ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Avatar deleted'),
  );
}
