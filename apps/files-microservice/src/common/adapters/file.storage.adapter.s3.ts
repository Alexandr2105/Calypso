import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { ApiConfigService } from '../helpers/api.config.service';

@Injectable()
export class FileStorageAdapterS3 {
  s3Client: S3Client;
  constructor(private apiConfigService: ApiConfigService) {
    console.log(apiConfigService.bucketName);
    console.log(apiConfigService.s3Region);
    console.log(apiConfigService.secretAccessKey);
    console.log(apiConfigService.accessKeyId);
    this.s3Client = new S3Client({
      region: apiConfigService.s3Region,
      endpoint: apiConfigService.baseUrlAws,
      credentials: {
        accessKeyId: apiConfigService.accessKeyId,
        secretAccessKey: apiConfigService.secretAccessKey,
      },
    });
  }

  async saveAvatar(userId: string, buffer: Buffer) {
    console.log(this.apiConfigService.bucketName);
    const key = `${userId}/avatars/${userId}&${+new Date()}_avatar.png`;

    const command = new PutObjectCommand({
      Key: key,
      Bucket: this.apiConfigService.bucketName,
      Body: buffer,
      ContentType: 'image/png',
    });
    try {
      await this.s3Client.send(command);
      return {
        id: randomUUID(),
        key: key,
        createdAt: new Date(),
        bucket: this.apiConfigService.bucketName,
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
      Bucket: this.apiConfigService.bucketName,
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
        bucket: this.apiConfigService.bucketName,
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
