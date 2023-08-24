import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RegistrationUserUseCase } from './features/auth/application/use-cases/registration-user.use-case';
import { CreateConfirmationInfoForUserUseCase } from './features/auth/application/use-cases/create-confirmation-info.use-case';
import { SendConfirmationLinkUseCase } from './features/auth/application/use-cases/send-confirmation-link.use-case';
import { ConfirmationEmailUseCase } from './features/auth/application/use-cases/confirmation-email.use-case';
import { RefreshConfirmationLinkUseCase } from './features/auth/application/use-cases/refresh-confirmation-link.use-case';
import { AuthController } from './features/auth/api/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './features/users/api/users.controller';
import { BcryptService } from './common/bcript/bcript.service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { EmailAdapter } from './common/SMTP-adapter/email-adapter';
import { CheckEmailInDb } from './features/users/validation/check-email-in-db.service';
import { TestingController } from './common/testing/testing.controller';
import { SendPasswordRecoveryLinkUseCase } from './features/auth/application/use-cases/send-password-recovery-link.use-case';
import { UsersService } from './features/users/application/users.service';
import { ChangePasswordUseCase } from './features/auth/application/use-cases/change-password.use-case';
import { settings } from './settings';
import { LocalStrategy } from './common/strategies/local.strategy';
import { Jwt } from './common/jwt/jwt';
import { JwtModule } from '@nestjs/jwt';
import { CreateAccessAndRefreshTokensUseCase } from './features/auth/application/use-cases/create-access-and-refresh-tokens.use-case';
import { CheckConfirmationCode } from './features/auth/validation/check-confirmation-code';
import { DevicesRepository } from './features/devices/infrastructure/devices.repository';
import { RefreshStrategy } from './common/strategies/refresh.strategy';
import { SaveInfoAboutDevicesUserUseCase } from './features/devices/application/use-cases/save.info.about.devices.user.use.case';
import { LogoutUserUseCase } from './features/devices/application/use-cases/logout.user.use.case';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './common/prisma/prisma.module';
import { UpdateInfoAboutDevicesUserUseCase } from './features/devices/application/use-cases/update.info.about.devices.user.use.case';
import { UsersProfilesController } from './features/users-profiles/api/users.profiles.controller';
import { SaveInfoAboutUsersProfilesUseCase } from './features/users-profiles/application/use-cases/save.info.about.users.profiles.use.case';
import { UsersProfilesRepository } from './features/users-profiles/infrastructure/users.profiles.repository';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { UploadAvatarUseCase } from './features/users-profiles/application/use-cases/upload.avatar.user.case';
import { GetUserProfileUseCase } from './features/users-profiles/application/use-cases/get.user.profile.use.case';
import { PostsController } from './features/posts/api/posts.controller';
import { CreatePostUseCase } from './features/posts/application/use-cases/create.post.use.case';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { CheckPostId } from './features/posts/validation/check.post.id';
import { UpdateDescriptionForPostUseCase } from './features/posts/application/use-cases/update.description.for.post.use.case';
import { DeletePostUseCase } from './features/posts/application/use-cases/delete.post.use.case';
import { QueryRepository } from './features/query-repository.ts/query.repository';
import { QueryHelper } from './common/helpers/query.helper';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GetUserByIdUseCase } from './features/users-profiles/application/use-cases/get.user.by.id.use.case';
import { DeleteProfileUseCase } from './features/users-profiles/application/use-cases/delete.profile.use.case';
import { DeleteUserUseCase } from './features/users/application/use-case/delete.user.use.case';
import { BasicStrategy } from './common/strategies/basic.strategy';
import { CreateUserOauth20UseCase } from './features/auth/application/use-cases/create.user.oauth20.use.case';
import { OAuth2ForGoogleUseCase } from './features/auth/application/use-cases/oauth2.for.google.use.case';
import { MergeGoogleAccountUseCase } from './features/auth/application/use-cases/merge.google.account.use.case';
import { UpdateConfirmationCodeUseCase } from './features/auth/application/use-cases/update.confirmation.code.use.case';
import { OAuth2ForGithubUseCase } from './features/auth/application/use-cases/oauth2ForGithubUseCase';
import { MergeGithubAccountUseCase } from './features/auth/application/use-cases/merge.github.account.use.case';
import { ApiConfigService } from './common/helpers/api.config.service';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';

const Strategies = [LocalStrategy, RefreshStrategy, JwtStrategy, BasicStrategy];
const Validators = [CheckEmailInDb, CheckConfirmationCode, CheckPostId];
const UseCases = [
  RegistrationUserUseCase,
  CreateConfirmationInfoForUserUseCase,
  SendConfirmationLinkUseCase,
  ConfirmationEmailUseCase,
  RefreshConfirmationLinkUseCase,
  SendPasswordRecoveryLinkUseCase,
  ChangePasswordUseCase,
  CreateAccessAndRefreshTokensUseCase,
  SaveInfoAboutDevicesUserUseCase,
  LogoutUserUseCase,
  UpdateInfoAboutDevicesUserUseCase,
  SaveInfoAboutUsersProfilesUseCase,
  UploadAvatarUseCase,
  GetUserProfileUseCase,
  CreatePostUseCase,
  UpdateDescriptionForPostUseCase,
  DeletePostUseCase,
  GetUserByIdUseCase,
  DeleteProfileUseCase,
  DeleteUserUseCase,
  OAuth2ForGoogleUseCase,
  CreateUserOauth20UseCase,
  MergeGoogleAccountUseCase,
  UpdateConfirmationCodeUseCase,
  OAuth2ForGithubUseCase,
  MergeGithubAccountUseCase,
];
const Repositories = [
  UsersRepository,
  DevicesRepository,
  UsersProfilesRepository,
  PostsRepository,
  QueryRepository,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'FILES_SERVICE_TCP',
        transport: Transport.TCP,
        options: {
          host: 'files-microservice-service',
          port: 3043,
          // port: 3001,
        },
      },
      {
        name: 'FILES_SERVICE_RMQ',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ],
          queue: 'FILES_SERVICE_RMQ',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    PrismaModule,
    CqrsModule,
    JwtModule.register({}),
    PassportModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'swagger-static'),
      serveRoot: settings.SWAGGER === 'development' ? '/' : '/swagger',
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    TestingController,
    UsersProfilesController,
    PostsController,
  ],
  providers: [
    AppService,
    BcryptService,
    UsersService,
    EmailAdapter,
    ...Validators,
    ...UseCases,
    ...Strategies,
    ...Repositories,
    Jwt,
    QueryHelper,
    ApiConfigService,
  ],
})
export class AppModule {}
