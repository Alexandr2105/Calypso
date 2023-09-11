import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DescriptionDto } from '../dto/description.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostCommand } from '../application/use-cases/create.post.use.case';
import { UpdateDescriptionForPostCommand } from '../application/use-cases/update.description.for.post.use.case';
import { PostIdDto } from '../dto/post.id.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostsEntity } from '../entities/posts.entity';
import { DeletePostCommand } from '../application/use-cases/delete.post.use.case';
import { QueryRepository } from '../../query-repository/query.repository';
import { PostEntityWithImage } from '../../../common/query-types/post.entity.with.image';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { checkPhotoSum } from '../validation/check.photo.sum';
import { QueryHelper } from '../../../../../../libraries/helpers/query.helper';
import { IdForCursorDto } from '../dto/id.for.cursor.dto';
import {
  SwaggerDecoratorByCreatePost,
  SwaggerDecoratorByDeletePostPostId,
  SwaggerDecoratorByGetPostPostId,
  SwaggerDecoratorByGetUserId,
  SwaggerDecoratorByPutPostPostId,
} from '../swagger/swagger.posts.decorators';

@ApiTags('Posts')
@Controller('/posts')
export class PostsController {
  constructor(
    @Inject('FILES_SERVICE_TCP') private clientTCP: ClientProxy,
    private commandBus: CommandBus,
    private postsRepository: PostsRepository,
    private queryRepository: QueryRepository,
    private queryHelper: QueryHelper,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByCreatePost()
  @Post('post')
  @UseInterceptors(FilesInterceptor('posts'))
  async createPosts(
    @UploadedFiles() posts: Array<Express.Multer.File>,
    @Body() body: DescriptionDto,
    @Req() req,
  ) {
    checkPhotoSum(posts);
    const pattern = { cmd: 'saveImages' };
    const post: PostsEntity = await this.commandBus.execute(
      new CreatePostCommand(body.description, req.user.id),
    );
    const data = await firstValueFrom(
      this.clientTCP.send(pattern, {
        arrayImages: posts,
        postId: post.id,
        userId: post.userId,
      }),
    );
    return { ...post, images: data };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByPutPostPostId()
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
  @SwaggerDecoratorByGetPostPostId()
  @Get('post/:postId')
  async getPost(@Param() param: PostIdDto): Promise<PostEntityWithImage> {
    const pattern = { cmd: 'getImages' };
    const postInfo = await this.postsRepository.getPostById(param.postId);
    const data = await firstValueFrom(
      this.clientTCP.send(pattern, param.postId),
    );
    return { ...postInfo, images: data };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByDeletePostPostId()
  @Delete('post/:postId')
  async deletePost(@Param() param: PostIdDto, @Req() req) {
    await this.commandBus.execute(
      new DeletePostCommand(param.postId, req.user.id),
    );
    const pattern = { cmd: 'deletePost' };
    this.clientTCP.emit(pattern, { userId: req.user.id, postId: param.postId });
  }

  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByGetUserId()
  @Get('/:userId')
  async getPostsCurrentUser(
    @Req() req,
    @Param('userId') userId: string,
    @Query() query,
    @Body() body: IdForCursorDto,
  ) {
    if (req.user.id !== userId) throw new ForbiddenException();
    const queryParam = this.queryHelper.queryParamHelper(query);
    return this.queryRepository.getPostsAndPhotos(
      req.user.id,
      body.postId,
      queryParam,
    );
  }
}
