import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImagesRepository } from '../../infrastructure/images.repository';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { AvatarsRepository } from '../../infrastructure/avatars.repository';
import { ApiConfigService } from '../../../../common/helpers/api.config.service';

export class DeleteAllUserProfileCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteAllUserProfileCommand)
export class DeleteAllUserProfileUseCase
  implements ICommandHandler<DeleteAllUserProfileCommand>
{
  constructor(
    private apiConfigService: ApiConfigService,
    private imagesRepository: ImagesRepository,
    private avatarRepository: AvatarsRepository,
    private fileStorage: FileStorageAdapterS3,
  ) {}

  async execute(command: DeleteAllUserProfileCommand): Promise<any> {
    await this.avatarRepository.deleteAvatarInfo(command.userId);
    await this.fileStorage.deleteFolder(
      this.apiConfigService.bucketName,
      command.userId,
    );
    await this.imagesRepository.deleteImagesForUser(command.userId);
  }
}
