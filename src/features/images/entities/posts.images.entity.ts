import { ApiProperty } from '@nestjs/swagger';

export class PostsImagesEntity {
  id: string;
  @ApiProperty({ type: 'string', description: 'Url image' })
  url: string;
  bucket: string;
  postId: string;
  key: string;
  width: number;
  height: number;
  fileSize: number;
  createdAt: Date;

  constructor(
    id: string,
    url: string,
    bucket: string,
    postId: string,
    key: string,
    width: number,
    height: number,
    fileSize: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.url = url;
    this.bucket = bucket;
    this.postId = postId;
    this.key = key;
    this.width = width;
    this.height = height;
    this.fileSize = fileSize;
    this.createdAt = createdAt;
  }
}
