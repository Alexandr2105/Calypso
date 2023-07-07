import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DescriptionDto } from '../dto/description.dto';
import { checkPhotoSum } from '../validation/check.photo.sum';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
import { CreatePostCommand } from '../application/use-cases/create.post.use.case';
import { UpdateDescriptionForPostCommand } from '../application/use-cases/update.description.for.post.use.case';
import { PostIdDto } from '../dto/post.id.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsEntity } from '../entities/posts.entity';

@ApiTags('Posts')
@Controller('/posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private postsRepository: PostsRepository,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create post. "fieldName" must be "posts"' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post created',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Post id',
        },
        userId: {
          type: 'string',
          description: 'UserId',
        },
        description: {
          type: 'string',
          description: 'Description post',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Created Date',
        },
        image: {
          type: 'array',
          items: {
            type: 'object',
            properties: { url: { type: 'string' } },
          },
        },
      },
    },
  })
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'List of possible errors:<br>1.Wrong length<br>2.More than 10 photos',
  )
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @Post('post')
  @UseInterceptors(FilesInterceptor('posts'))
  async createPosts(
    @UploadedFiles() posts: any[],
    @Body() body: DescriptionDto,
    @Req() req,
  ) {
    checkPhotoSum(posts);
    return this.commandBus.execute(
      new CreatePostCommand(posts, body.description, req.user.id),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update description for post' })
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'List of possible errors:<br>1.Post not found<br>2.Wrong length',
  )
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiResponseForSwagger(HttpStatus.FORBIDDEN, 'Forbidden')
  @Put('post/:postId')
  async updatePost(
    @Body() body: DescriptionDto,
    @Param() param: PostIdDto,
    @Req() req,
  ) {
    await this.commandBus.execute(
      new UpdateDescriptionForPostCommand(
        body.description,
        param.postId,
        req.user.id,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get info for post' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostsEntity,
  })
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @Get('post/:postId')
  async getPost(@Param() param: PostIdDto): Promise<PostsEntity> {
    return this.postsRepository.getPostById(param.postId);
  }
}
