import { PostsEntity } from '../../features/posts/entities/posts.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PostsImagesEntity } from '../../features/images/entities/posts.images.entity';

export class PostEntityWithImage extends PostsEntity {
  @ApiProperty({ type: [PostsImagesEntity] })
  'images': PostsImagesEntity[];
}
