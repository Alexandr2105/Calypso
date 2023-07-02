import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class FileStorageAdapterS3 {
  s3Client: S3Client;
  constructor() {
    const REGION = 'ru-central1';
    this.s3Client = new S3Client({
      region: REGION,
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        accessKeyId: 'YCAJE0FJh8Ruav5UQGAFm8VQy',
        secretAccessKey: 'YCMMe7NXFLImrmITDs_CWTSopEnXIeUB2Qls1cf6',
      },
    });
  }

  async saveAvatar(userId: string, buffer: Buffer) {
    const command = new PutObjectCommand({
      Bucket: 'shvs1510',
      Key: `${userId}/avatars/${userId}_avatar.png`,
      Body: buffer,
      ContentType: 'image/png',
    });

    console.log(buffer);
    try {
      await this.s3Client.send(command);
      console.log(command);
      return `${userId}/avatars/${userId}_avatar.png`;
    } catch (err) {
      console.error(err);
    }
  }

  // async saveImageForPost(
  //   userId: string,
  //   fileName: string,
  //   wallpaperBuffer: Buffer,
  //   folderName: string,
  //   blogId: string,
  //   postId: string,
  //   infoSize: string,
  // ): Promise<ImageModelDocument> {
  //   const command = new PutObjectCommand({
  //     Bucket: 'my1bucket',
  //     Key: `images/${folderName}/${postId}_post_${infoSize}.png`,
  //     Body: wallpaperBuffer,
  //     ContentType: 'image/png',
  //   });
  //   try {
  //     await this.s3Client.send(command);
  //     const newImage = new this.image();
  //     newImage.id = +new Date() + '';
  //     newImage.blogId = blogId;
  //     newImage.key = `images/${folderName}/${postId}_post_${infoSize}.png`;
  //     newImage.bucket = 'my1bucket';
  //     newImage.postId = postId;
  //     return newImage;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // async getImage(bucket: string, key: string) {
  //   const command = new GetObjectCommand({
  //     Bucket: bucket,
  //     Key: key,
  //   });
  //   const a = await this.s3Client.send(command);
  // }
}
