import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserModel } from './models/user.model';
import { UsersRepositoryGraphql } from '../infrastructure/users.repository.graphql';
import { QueryRepositoryGraphql } from '../query-repository/query.repository.graphql';
import { PaginationDto } from './dto/pagination.dto';
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
import { DeleteUserCommand } from '../../features/users/application/use-case/delete.user.use.case';
import { CommandBus } from '@nestjs/cqrs';
import { GetUserCommand } from '../application/use-cases/get.user.use.case';
import { UseGuards } from '@nestjs/common';
import { BasicAuthGuardForGraphql } from '../guards/basic.auth.guard.for.graphql';
import { UpdateUserStatusDto } from './dto/update.user.status.dto';
import { UpdateUserStatusCommand } from '../application/use-cases/update.user.status.use.case';

@UseGuards(BasicAuthGuardForGraphql)
@Resolver(() => UserModel)
export class SuperAdminResolver {
  constructor(
    private usersRepository: UsersRepositoryGraphql,
    private queryRepository: QueryRepositoryGraphql,
    private commandBus: CommandBus,
  ) {}

  @Query(() => [UserModel], { name: 'users' })
  async getUsers(@Args() args: PaginationDto): Promise<UserModel[]> {
    return this.queryRepository.getUsers(args);
  }

  @Query(() => UserModel, { name: 'user', nullable: true })
  async getUser(@Args('id') id: string): Promise<UserModel> {
    return this.commandBus.execute(new GetUserCommand(id));
  }

  @Query(() => Int, { name: 'totalCountUsers' })
  async getTotalCountUsers(@Args() args: PaginationDto): Promise<number> {
    return this.queryRepository.getTotalCountUsers(args);
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

  @Mutation(() => Boolean)
  async deleteUser(@Args('userId') userId: string) {
    await this.commandBus.execute(new GetUserCommand(userId));
    await this.commandBus.execute(new DeleteUserCommand(userId));
    return true;
  }

  @Mutation(() => Boolean, { description: 'ban/unban' })
  async updateUserStatus(@Args() args: UpdateUserStatusDto) {
    await this.commandBus.execute(new GetUserCommand(args.userId));
    await this.commandBus.execute(new UpdateUserStatusCommand(args));
    return true;
  }
}
