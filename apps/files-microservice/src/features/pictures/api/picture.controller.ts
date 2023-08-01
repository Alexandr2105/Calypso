import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { UploadAvatarCommand } from '../application/use-cases/upload.avatar.use.case';
import { AvatarsDto } from '../dto/avatars.dto';
import { PostsDto } from '../dto/posts.dto';
import { CreateImagesForPostCommand } from '../application/use-cases/create.images.for.post.use.case';
import { GetImagesForPostCommand } from '../application/use-cases/get.images.for.post.use.case';
import { DeletePostImagesCommand } from '../application/use-cases/delete.post.images.use.case';
import { DeleteProfileCommand } from '../application/use-cases/delete.profile.use.case';

@Controller('saveAvatars')
export class PictureController {
  constructor(private commandBus: CommandBus) {}

  @MessagePattern({ cmd: 'saveAvatar' })
  async saveAvatars(data: AvatarsDto): Promise<string> {
    return this.commandBus.execute(
      new UploadAvatarCommand(data.userId, data.avatar),
    );
  }

  @MessagePattern({ cmd: 'saveImages' })
  async saveImagesForPosts(data: PostsDto) {
    return this.commandBus.execute(new CreateImagesForPostCommand(data));
  }

  @MessagePattern({ cmd: 'getImages' })
  async getImages(data: string) {
    return this.commandBus.execute(new GetImagesForPostCommand(data));
  }

  @EventPattern({ cmd: 'deleteImages' })
  async deleteImages(data: string) {
    await this.commandBus.execute(new DeletePostImagesCommand(data));
  }

  @EventPattern({ cmd: 'deleteProfile' })
  async deleteProfile(id: string) {
    await this.commandBus.execute(new DeleteProfileCommand(id));
  }
}
