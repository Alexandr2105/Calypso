import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { settings } from '../../settings';
import { randomUUID } from 'crypto';

@Injectable()
export class FileStorageAdapterS3 {
  s3Client: S3Client;
  constructor() {
    const REGION = 'ru-central1';
    this.s3Client = new S3Client({
      region: REGION,
      endpoint: settings.BASE_URL_AWS,
      credentials: {
        accessKeyId: settings.ACCESS_KEY_ID,
        secretAccessKey: settings.SECRET_ACCESS_KEY,
      },
    });
  }

  async saveAvatar(userId: string, buffer: Buffer) {
    const command = new PutObjectCommand({
      Bucket: settings.BACKET_NAME,
      Key: `${userId}/avatars/${userId}_avatar.png`,
      Body: buffer,
      ContentType: 'image/png',
    });
    try {
      await this.s3Client.send(command);
      return `${userId}/avatars/${userId}_avatar.png`;
    } catch (err) {
      console.error(err);
    }
  }

  async saveImagesForPost(
    userId: string,
    photos: Buffer[],
    postId: string,
  ): Promise<any> {
    const arrayKeys = [];
    for (const photo of photos) {
      const command = new PutObjectCommand({
        Bucket: settings.BACKET_NAME,
        Key: `${userId}/posts/${postId}/${randomUUID()}_post.png`,
        Body: photo,
        ContentType: 'image/png',
      });
      try {
        await this.s3Client.send(command);
        arrayKeys.push(`${userId}/posts/${postId}/${randomUUID()}_post.png`);
      } catch (err) {
        console.error(err);
      }
    }
    return arrayKeys;
  }
}
