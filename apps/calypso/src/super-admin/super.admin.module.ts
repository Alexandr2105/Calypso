import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { SuperAdminResolver } from './api/super.admin.resolver';
import { PrismaService } from '../common/prisma/prisma-service';
import { UsersRepositoryGraphql } from './infrastructure/users.repository.graphql';
import { QueryRepositoryGraphql } from './query-repository/query.repository.graphql';
import { QueryHelper } from '../../../../libraries/helpers/query.helper';
import { DataLoaderInterceptor } from 'nestjs-dataloader';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PostsLoaderForGraphql } from '../common/helpers/posts.loader.for.graphql';
import { ClientsModule, Transport } from '@nestjs/microservices';
import process from 'process';
import { PostsRepository } from '../features/posts/infrastructure/posts.repository';
import { FilesLoaderForGraphql } from '../common/helpers/files.loader.for.graphql';
import { ProfilesLoaderForGraphql } from '../common/helpers/profiles.loader.for.graphql';
import { UsersProfilesRepository } from '../features/users-profiles/infrastructure/users.profiles.repository';
import { PaymentsLoaderForGraphql } from '../common/helpers/payments.loader.for.graphql';
import { HttpModule } from '@nestjs/axios';
import { ApiConfigService } from '../common/helpers/api.config.service';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserUseCase } from './application/use-cases/get.user.use.case';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILES_SERVICE_TCP',
        transport: Transport.TCP,
        options: {
          host: process.env.FILES_SERVICE_HOST || 'files-microservice-service',
          port: Number(process.env.FILES_SERVICE_PORT || '3043'),
          // host: '0.0.0.0',
          // port: 3001,
        },
      },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'apps/calypso/src/schema.gql',
    }),
    HttpModule,
    CqrsModule,
  ],
  providers: [
    SuperAdminResolver,
    PrismaService,
    UsersRepositoryGraphql,
    QueryRepositoryGraphql,
    QueryHelper,
    PostsLoaderForGraphql,
    FilesLoaderForGraphql,
    ProfilesLoaderForGraphql,
    PaymentsLoaderForGraphql,
    UsersProfilesRepository,
    ApiConfigService,
    PostsRepository,
    GetUserUseCase,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class SuperAdminModule {}
