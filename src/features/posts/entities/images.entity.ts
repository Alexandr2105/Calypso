export class ImagesEntity {
  id: string;
  url: string;
  bucket: string;
  postId: string;
  key: number;
  width: number;
  height: number;
  fileSize: number;

  constructor(
    id: string,
    url: string,
    bucket: string,
    postId: string,
    key: number,
    width: number,
    height: number,
    fileSize: number,
  ) {
    this.id = id;
    this.url = url;
    this.bucket = bucket;
    this.postId = postId;
    this.key = key;
    this.width = width;
    this.height = height;
    this.fileSize = fileSize;
  }
}
