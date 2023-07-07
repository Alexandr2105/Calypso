import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';

@ValidatorConstraint({ name: 'checkPostId', async: true })
@Injectable()
export class CheckPostId implements ValidatorConstraintInterface {
  constructor(private postsRepository: PostsRepository) {}

  async validate(postId: string): Promise<boolean> {
    const post = await this.postsRepository.getPostById(postId);
    if (post) return true;
  }

  defaultMessage(): string {
    return 'Post not found';
  }
}
