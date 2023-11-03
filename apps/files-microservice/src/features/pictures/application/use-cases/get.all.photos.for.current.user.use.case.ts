import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImagesRepository } from '../../infrastructure/images.repository';
import { ImageModel } from '../../../../../../calypso/src/super-admin/api/models/image.model';

export class GetAllPhotosForCurrentUserCommand {
  constructor(public userId: string[]) {}
}

@CommandHandler(GetAllPhotosForCurrentUserCommand)
export class GetAllPhotosForCurrentUserUseCase
  implements ICommandHandler<GetAllPhotosForCurrentUserCommand>
{
  constructor(private imagesRepository: ImagesRepository) {}

  async execute(
    command: GetAllPhotosForCurrentUserCommand,
  ): Promise<ImageModel[]> {
    return await this.imagesRepository.getAllImagesForUser(command.userId);
  }
}
