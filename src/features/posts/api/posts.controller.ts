import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DescriptionDto } from '../dto/description.dto';
import { validatePhoto } from '../validation/posts.validate';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
import { CreatePostCommandBus } from '../application/use-cases/create.post.use.case';

@ApiTags('Posts')
@Controller('/posts')
export class PostsController {
  constructor(private commandBus: CommandBus) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create post. "fieldName" must be "posts"' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Post created')
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'List of possible errors:<br>1.Wrong length<br>2.More than 10 photos',
  )
  @Post('create')
  @UseInterceptors(FilesInterceptor('posts'))
  async createPosts(
    @UploadedFiles() posts: any[],
    @Body() body: DescriptionDto,
    @Req() req,
  ) {
    validatePhoto(posts);
    await this.commandBus.execute(
      new CreatePostCommandBus(posts, body.description, req.user.id),
    );
  }
}
