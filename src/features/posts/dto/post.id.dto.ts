import { Validate } from 'class-validator';
import { CheckPostId } from '../validation/check.post.id';

export class PostIdDto {
  @Validate(CheckPostId)
  postId: string;
}
