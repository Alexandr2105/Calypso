import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AvatarDocument } from '../../features/pictures/schemas/avatar.schema';
import { PostImagesDocument } from '../../features/pictures/schemas/post.images.schema';

@Controller('delete-all-data')
export class TestingController {
  constructor(
    @InjectModel('avatar') private avatar: Model<AvatarDocument>,
    @InjectModel('postImages') private postImages: Model<PostImagesDocument>,
  ) {}

  @EventPattern({ cmd: 'deleteAll' })
  async deleteAll() {
    await this.avatar.deleteMany({});
    await this.postImages.deleteMany({});
  }
}
