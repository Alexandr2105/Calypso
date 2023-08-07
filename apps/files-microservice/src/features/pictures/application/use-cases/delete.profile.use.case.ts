import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { AvatarsRepository } from '../../infrastructure/avatars.repository';

export class DeleteProfileCommand {
  constructor(public userId: string) {}
}
@CommandHandler(DeleteProfileCommand)
export class DeleteProfileUseCase
  implements ICommandHandler<DeleteProfileCommand>
{
  constructor(
    private avatarsRepository: AvatarsRepository,
    private fileStorage: FileStorageAdapterS3,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const avatar = await this.avatarsRepository.getAvatarInfo(command.userId);
    if (avatar) {
      await this.avatarsRepository.deleteAvatarInfo(command.userId);
      await this.fileStorage.deleteImage(avatar.bucket, avatar.key);
    } else {
      return;
    }
  }
}
