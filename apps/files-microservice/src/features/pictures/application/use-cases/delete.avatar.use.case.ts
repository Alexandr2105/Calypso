import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AvatarsRepository } from '../../infrastructure/avatars.repository';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { AvatarDocument } from '../../schemas/avatar.schema';

export class DeleteAvatarCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarUseCase
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(
    private avatarRepository: AvatarsRepository,
    private fileStorage: FileStorageAdapterS3,
  ) {}

  async execute(command: DeleteAvatarCommand): Promise<void> {
    const avatarInfo: AvatarDocument =
      await this.avatarRepository.getAvatarInfo(command.userId);
    if (avatarInfo) {
      await this.avatarRepository.deleteAvatar(command.userId);
      await this.fileStorage.deleteImage(avatarInfo.bucket, avatarInfo.key);
    }
  }
}
