import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { settings } from '../../settings';
import * as process from 'process';

@Injectable()
export class FileStorageAdapterS3 {
  s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({
      // region: settings.S3_REGION,
      region: 'ru-central1',
      // endpoint: settings.BASE_URL_AWS,
      endpoint: 'https://storage.yandexcloud.net',
      credentials: {
        // accessKeyId: settings.ACCESS_KEY_ID,
        // secretAccessKey: settings.SECRET_ACCESS_KEY,
        accessKeyId: 'YCAJEoc13VNh8lGnC8i4-8H0A',
        secretAccessKey: 'YCOhoLcWlwcv6E9F9uqbRMTXCOPBxoNANFezXmRi',
      },
    });
  }

  async saveAvatar(userId: string, buffer: Buffer) {
    const key = `${userId}/avatars/${userId}&${+new Date()}_avatar.png`;

    console.log(this.s3Client.config);
    console.log(this.s3Client.config.region);

    const command = new PutObjectCommand({
      Key: key,
      // Bucket: settings.BACKET_NAME,
      // Bucket: process.env.BACKET_NAME,
      Bucket: 'my1bucket',
      Body: buffer,
      ContentType: 'image/png',
    });
    try {
      console.log(command);
      console.log(settings.BACKET_NAME);
      console.log(settings.S3_REGION);
      console.log(settings.BASE_URL_AWS);
      console.log(settings.SECRET_ACCESS_KEY);
      console.log(settings.BASE_URL_AWS);
      await this.s3Client.send(command);
      console.log({
        id: randomUUID(),
        key: key,
        createdAt: new Date(),
        bucket: settings.BACKET_NAME,
      });
      return {
        id: randomUUID(),
        key: key,
        createdAt: new Date(),
        bucket: settings.BACKET_NAME,
      };
    } catch (err) {
      console.error(err);
    }
  }

  async saveImagesForPost(
    userId: string,
    buffer: Buffer,
    postId: string,
  ): Promise<any> {
    const randomName = randomUUID();
    const command = new PutObjectCommand({
      Bucket: settings.BACKET_NAME,
      Key: `${userId}/posts/${postId}/${randomName}_post.png`,
      Body: buffer,
      ContentType: 'image/png',
    });
    try {
      await this.s3Client.send(command);
      return {
        id: randomUUID(),
        key: `${userId}/posts/${postId}/${randomName}_post.png`,
        postId: postId,
        createdAt: new Date(),
        bucket: settings.BACKET_NAME,
      };
    } catch (err) {
      console.error(err);
    }
  }

  async deleteImage(bucket: string, key: string) {
    const command = new DeleteObjectCommand({ Bucket: bucket, Key: key });
    try {
      await this.s3Client.send(command);
    } catch (err) {
      console.error(err);
    }
  }

  async deleteFolder(bucket: string, folderName: string): Promise<boolean> {
    const objects = await this.s3Client.send(
      new ListObjectsCommand({ Bucket: bucket, Prefix: folderName }),
    );

    if (objects.Contents && objects.Contents.length > 0) {
      const objectsToDelete = objects.Contents.map((obj) => ({
        Key: obj.Key,
      }));
      await this.s3Client.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: objectsToDelete },
        }),
      );
      return true;
    } else {
      return true;
      // console.log(`Папка "${folderName}" пустая или не существует.`);
    }
  }
}
