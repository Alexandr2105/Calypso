import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostImagesDocument } from '../schemas/post.images.schema';

@Injectable()
export class ImagesRepository {
  constructor(
    @InjectModel('postImages') private postImages: Model<PostImagesDocument>,
  ) {}

  async createNewImage(image: PostImagesDocument): Promise<PostImagesDocument> {
    return image.save();
  }

  async deleteImagesForPost(postId: string) {
    await this.postImages.deleteMany({ postId: postId });
  }

  async deleteImagesForUser(userId: string) {
    await this.postImages.deleteMany({ userId: userId });
  }

  async getImages(postId: string): Promise<PostImagesDocument[]> {
    return this.postImages.find({
      postId: postId,
    });
  }

  async getAllImagesForUser(userId: string[]) {
    return this.postImages.find({ userId: { $in: userId } });
  }
}
