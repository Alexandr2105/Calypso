import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { UsersProfilesRepository } from '../../infrastructure/users.profiles.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { settings } from '../../../../settings';
import { resizePhoto } from '../../../../common/helpers/resize.photo';

export class UploadAvatarCommand {
  constructor(public userId: string, public buffer: Buffer) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarUseCase
  implements ICommandHandler<UploadAvatarCommand>
{
  constructor(
    private fileStorageAdapter: FileStorageAdapterS3,
    private profilesRepository: UsersProfilesRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: UploadAvatarCommand): Promise<any> {
    const avatar = await resizePhoto(command.buffer);

    const key = await this.fileStorageAdapter.saveAvatar(
      command.userId,
      avatar,
    );
    const user = await this.usersRepository.getUserById(command.userId);
    await this.profilesRepository.saveUsersProfiles({
      userId: command.userId,
      login: user.login,
      photo: `${settings.BASE_URL_AWS}/${settings.BACKET_NAME}/${key}`,
    });
  }
}
