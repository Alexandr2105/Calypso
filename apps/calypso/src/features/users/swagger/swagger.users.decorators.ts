import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';

export function SwaggerDecoratorByDeleteUserId(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user for test' }),
    ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'User deleted'),
    ApiBasicAuth(),
  );
}
