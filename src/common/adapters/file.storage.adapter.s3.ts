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
    try {
      await this.s3Client.send(command);
      return `${userId}/avatars/${userId}_avatar.png`;
    } catch (err) {
      console.error(err);
    }
  }
}
