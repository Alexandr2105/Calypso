import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefreshTokenType } from '../../../common/types/refresh.token.type';

export function SwaggerDecoratorByGetAllDevicesCurrentUser(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get devices for current user' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: [RefreshTokenType],
    }),
  );
}

export function SwaggerDecoratorByDeleteDevice(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Deactivate a session from one device' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Session deleted',
    }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' }),
  );
}

export function SwaggerDecoratorByDeleteAllDevicesExceptTheCurrentDevice(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Remove all devices except the current device' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Sessions deleted',
    }),
  );
}
