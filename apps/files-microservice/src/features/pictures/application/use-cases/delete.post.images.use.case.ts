import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImagesRepository } from '../../infrastructure/images.repository';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { ApiConfigService } from '../../../../common/helpers/api.config.service';

export class DeletePostImagesCommand {
  constructor(public postId: string) {}
}

@CommandHandler(DeletePostImagesCommand)
export class DeletePostImagesUseCase
  implements ICommandHandler<DeletePostImagesCommand>
{
  constructor(
    private apiConfigService: ApiConfigService,
    private imagesRepository: ImagesRepository,
    private fileStorage: FileStorageAdapterS3,
  ) {}

  async execute(command: DeletePostImagesCommand): Promise<any> {
    await this.imagesRepository.deleteImagesForPost(command.postId);
    await this.fileStorage.deleteFolder(
      this.apiConfigService.bucketName,
      command.postId,
    );
  }
}
