import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImagesRepository } from '../../infrastructure/images.repository';
import { FileStorageAdapterS3 } from '../../../../common/adapters/file.storage.adapter.s3';
import { ApiConfigService } from '../../../../common/helpers/api.config.service';
import { DelPostsDto } from '../../dto/del.posts.dto';

export class DeletePostImagesCommand {
  constructor(public data: DelPostsDto) {}
}

@CommandHandler(DeletePostImagesCommand)
export class DeletePostImagesUseCase
  implements ICommandHandler<DeletePostImagesCommand>
{
  constructor(
    private imagesRepository: ImagesRepository,
    private fileStorage: FileStorageAdapterS3,
    private apiConfigService: ApiConfigService,
  ) {}

  async execute(command: DeletePostImagesCommand): Promise<any> {
    await this.imagesRepository.deleteImagesForPost(command.data.postId);
    await this.fileStorage.deletePostFolder(
      this.apiConfigService.bucketName,
      command.data.postId,
      command.data.userId,
    );
  }
}
