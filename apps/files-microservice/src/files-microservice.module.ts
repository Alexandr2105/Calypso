import { Module } from '@nestjs/common';
import { FilesMicroserviceController } from './files-microservice.controller';
import { FilesMicroserviceService } from './files-microservice.service';
import { PictureController } from './features/pictures/api/picture.controller';
import { TestingController } from './common/testing/testing.controller';
import { AvatarSchema } from './features/pictures/schemas/avatar.schema';
import { PostImagesSchema } from './features/pictures/schemas/post.images.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadAvatarUseCase } from './features/pictures/application/use-cases/upload.avatar.use.case';
import { FileStorageAdapterS3 } from './common/adapters/file.storage.adapter.s3';
import { AvatarsRepository } from './features/pictures/infrastructure/avatars.repository';
import { ImagesRepository } from './features/pictures/infrastructure/images.repository';
import { CreateImagesForPostUseCase } from './features/pictures/application/use-cases/create.images.for.post.use.case';
import { DeletePostImagesUseCase } from './features/pictures/application/use-cases/delete.post.images.use.case';
import { GetImagesForPostUseCase } from './features/pictures/application/use-cases/get.images.for.post.use.case';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteProfileUseCase } from './features/pictures/application/use-cases/delete.profile.use.case';
import { DeleteAllUserProfileUseCase } from './features/pictures/application/use-cases/delete.all.user.profile.use.case';
import { settings } from './settings';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB').trim(),
        // uri: 'mongodb+srv://5030553:admin@cluster0.zrjj8ew.mongodb.net/calypso?retryWrites=true&w=majority',
        // uri: settings.MONGO_DB.trim(),
        // uri: process.env.MONGO_DB,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'avatar', schema: AvatarSchema },
      { name: 'postImages', schema: PostImagesSchema },
    ]),
    CqrsModule,
  ],
  controllers: [
    FilesMicroserviceController,
    PictureController,
    TestingController,
  ],
  providers: [
    FilesMicroserviceService,
    UploadAvatarUseCase,
    FileStorageAdapterS3,
    AvatarsRepository,
    ImagesRepository,
    CreateImagesForPostUseCase,
    GetImagesForPostUseCase,
    DeletePostImagesUseCase,
    DeleteProfileUseCase,
    DeleteAllUserProfileUseCase,
  ],
})
export class FilesMicroserviceModule {}
