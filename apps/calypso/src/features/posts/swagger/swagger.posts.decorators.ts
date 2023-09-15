import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PostEntityWithImage } from '../../../common/query-types/post.entity.with.image';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
import { PostQueryType } from '../../../common/query-types/post.query.type';
import {
  pageSizeQuery,
  sortByQuery,
  sortDirectionQuery,
} from '../../../../../../libraries/types/paging.and.sorting.query.for.swagger.type';

export function SwaggerDecoratorByCreatePost(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create post. "fieldName" must be "posts"' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Post created',
      type: PostEntityWithImage,
    }),
    ApiResponseForSwagger(
      HttpStatus.BAD_REQUEST,
      'List of possible errors:<br>1.Wrong length<br>2.More than 10 photos',
    ),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
  );
}

export function SwaggerDecoratorByPutPostPostId(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update description for post' }),
    ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Post updated'),
    ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Wrong length'),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
    ApiResponseForSwagger(HttpStatus.FORBIDDEN, 'Forbidden'),
    ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found'),
  );
}

export function SwaggerDecoratorByGetPostPostId(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get info for post' }),
    ApiResponse({
      status: HttpStatus.OK,
      type: PostEntityWithImage,
    }),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
    ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found'),
  );
}

export function SwaggerDecoratorByDeletePostPostId(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete post' }),
    ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Post deleted'),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
    ApiResponseForSwagger(HttpStatus.FORBIDDEN, 'Forbidden'),
    ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found'),
  );
}

export function SwaggerDecoratorByGetUserId(): MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get post for current user' }),
    ApiResponse({ status: HttpStatus.OK, type: PostQueryType }),
    ApiQuery(pageSizeQuery),
    ApiQuery(sortDirectionQuery),
    ApiQuery(sortByQuery),
    ApiQuery({
      description: 'If the request is the first then postId="0"',
      type: 'string',
      name: 'postId',
    }),
    ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized'),
    ApiResponseForSwagger(HttpStatus.FORBIDDEN, 'Forbidden'),
  );
}
