import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import { ImageModel } from '../../super-admin/api/models/image.model';
import DataLoader from 'dataloader';
import { PostsRepository } from '../../features/posts/infrastructure/posts.repository';
import { PostModel } from '../../super-admin/api/models/post.model';

@Injectable()
export class PostsLoaderForGraphql
  implements NestDataLoader<string, ImageModel>
{
  constructor(private postsRepository: PostsRepository) {}

  generateDataLoader(): DataLoader<string, PostModel[] | null> {
    return new DataLoader<string, PostModel[] | null>(
      async (usersIds: string[]) => {
        const data = await this.postsRepository.getAllPosts(usersIds);
        return usersIds.map((id) => {
          return data.filter((post) => post.userId === id) || null;
        });
      },
    );
  }
}
