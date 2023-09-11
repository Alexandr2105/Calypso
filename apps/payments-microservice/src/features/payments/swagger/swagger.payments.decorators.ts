import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PaymentsDto } from '../dto/payments.dto';
import { UrlForSwaggerType } from '../../../common/types/url.for.swagger.type';
import { ErrorsMessageForSwaggerType } from '../../../common/types/errors.message.for.swagger.type';
import { ProductsEntity } from '../entities/products.entity';
import { SubscriptionForSwaggerType } from '../../../common/types/subscription.for.swagger.type';
import { PaymentsQueryType } from '../../../common/query-types/payments.query.type';

export function SwaggerDecoratorByPostStripe(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Payment by stipe' }),
    ApiBody({ type: [PaymentsDto] }),
    ApiResponse({
      status: HttpStatus.OK,
      type: UrlForSwaggerType,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      type: ErrorsMessageForSwaggerType,
    }),
  );
}

export function SwaggerDecoratorByPostPaypal(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Payment by paypal' }),
    ApiBearerAuth(),
    ApiBody({ type: [PaymentsDto] }),
    ApiResponse({
      status: HttpStatus.OK,
      type: UrlForSwaggerType,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      type: ErrorsMessageForSwaggerType,
    }),
  );
}

export function SwaggerDecoratorByGetSubscriptions(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'All subscriptions' }),
    ApiBearerAuth(),
    ApiResponse({ status: HttpStatus.OK, type: [ProductsEntity] }),
  );
}

export function SwaggerDecoratorByGetCurrentSubscriptions(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'All subscriptions for current user' }),
    ApiBearerAuth(),
    ApiResponse({ status: HttpStatus.OK, type: SubscriptionForSwaggerType }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' }),
  );
}

export function SwaggerDecoratorByGetPayments(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'All payments for current user' }),
    ApiBearerAuth(),
    ApiResponse({ status: HttpStatus.OK, type: PaymentsQueryType }),
  );
}
