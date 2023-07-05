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
import { CreatePostCommandBus } from '../application/use-cases/create.post.use.case';

@Controller('/posts')
export class PostsController {
  constructor(private commandBus: CommandBus) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
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
