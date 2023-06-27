import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { config } from 'dotenv';
import { RegistrationUserUseCase } from './features/auth/application/use-cases/registration-user.use-case';
import { CreateConfirmationInfoForUserUseCase } from './features/auth/application/use-cases/create-confirmation-info.use-case';
import { SendConfirmationLinkUseCase } from './features/auth/application/use-cases/send-confirmation-link.use-case';
import { ConfirmationEmailUseCase } from './features/auth/application/use-cases/confirmation-email.use-case';
import { RefreshConfirmationLinkUseCase } from './features/auth/application/use-cases/refresh-confirmation-link.use-case';
import { AuthController } from './features/auth/api/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './features/users/api/users.controller';
import { BcryptService } from './common/bcript/bcript.service';
import { PrismaService } from './common/prisma-service/prisma-service';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { EmailAdapter } from './common/SMTP-adapter/email-adapter';
import { CheckLoginOrEmailInDb } from './features/users/validation/check-login-or-email-in-db';
import { TestingController } from './common/testing/testing.controller';
import { SendPasswordRecoveryLinkUseCase } from './features/auth/application/use-cases/send-password-recovery-link.use-case';
import { UsersService } from './features/users/application/users.service';

config();

const UseCases = [
  RegistrationUserUseCase,
  CreateConfirmationInfoForUserUseCase,
  SendConfirmationLinkUseCase,
  ConfirmationEmailUseCase,
  RefreshConfirmationLinkUseCase,
  SendPasswordRecoveryLinkUseCase,
];
@Module({
  imports: [
    CqrsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    TestingController,
  ],
  providers: [
    AppService,
    BcryptService,
    PrismaService,
    UsersService,
    UsersRepository,
    EmailAdapter,
    CheckLoginOrEmailInDb,
    ...UseCases,
  ],
})
export class AppModule {}
