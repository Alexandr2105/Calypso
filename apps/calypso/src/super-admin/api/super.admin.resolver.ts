import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserModel } from './models/user.model';
import { UsersRepositoryGraphql } from '../infrastructure/users.repository.graphql';
import { QueryRepositoryGraphql } from '../query-repository/query.repository.graphql';
import { PaginationUserDto } from './dto/pagination.user.dto';
import { PostsLoaderForGraphql } from '../../common/helpers/posts.loader.for.graphql';
import { Loader } from 'nestjs-dataloader';
import DataLoader from 'dataloader';
import { ImageModel } from './models/image.model';
import { PostModel } from './models/post.model';
import { FilesLoaderForGraphql } from '../../common/helpers/files.loader.for.graphql';
import { ProfileModel } from './models/profile.model';
import { ProfilesLoaderForGraphql } from '../../common/helpers/profiles.loader.for.graphql';
import { PaymentModel } from './models/payments.model';
import { PaymentsLoaderForGraphql } from '../../common/helpers/payments.loader.for.graphql';

@Resolver(() => UserModel)
export class SuperAdminResolver {
  constructor(
    private usersRepository: UsersRepositoryGraphql,
    private queryRepository: QueryRepositoryGraphql,
  ) {}

  @Query(() => [UserModel], { name: 'users' })
  async getUsers(@Args() args: PaginationUserDto): Promise<UserModel[]> {
    return this.queryRepository.getUsers(args);
  }

  @Query(() => UserModel, { name: 'user' })
  async getUser(@Args('id') id: string): Promise<UserModel> {
    return this.usersRepository.getUser(id);
  }

  @ResolveField(() => [PostModel], { nullable: true })
  async posts(
    @Parent() user: UserModel,
    @Loader(PostsLoaderForGraphql)
    postsLoader: DataLoader<string, PostsLoaderForGraphql>,
  ) {
    const { id } = user;
    return await postsLoader.load(id);
  }

  @ResolveField(() => [ImageModel], { nullable: true })
  async images(
    @Parent() user: UserModel,
    @Loader(FilesLoaderForGraphql)
    filesLoader: DataLoader<string, FilesLoaderForGraphql>,
  ) {
    const { id } = user;
    return await filesLoader.load(id);
  }

  @ResolveField(() => ProfileModel, { nullable: true })
  async profiles(
    @Parent() user: UserModel,
    @Loader(ProfilesLoaderForGraphql)
    profilesLoader: DataLoader<string, ProfilesLoaderForGraphql>,
  ) {
    const { id } = user;
    return await profilesLoader.load(id);
  }

  @ResolveField(() => [PaymentModel], { nullable: true })
  async payments(
    @Parent() user: UserModel,
    @Loader(PaymentsLoaderForGraphql)
    paymentsLoader: DataLoader<string, PaymentsLoaderForGraphql>,
  ) {
    const { id } = user;
    return await paymentsLoader.load(id);
  }
}
