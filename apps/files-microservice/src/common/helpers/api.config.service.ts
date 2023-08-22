import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import * as process from 'process';

@Injectable()
export class ApiConfigService {
  constructor(private configService: NestConfigService) {}

  get accessKeyId(): string {
    return this.configService.get('ACCESS_KEY_ID');
  }

  get secretAccessKey(): string {
    return this.configService.get('SECRET_ACCESS_KEY');
  }

  get s3Region(): string {
    return this.configService.get('S3_REGION');
  }

  get baseUrlAws(): string {
    return this.configService.get('BASE_URL_AWS');
  }

  get bucketName(): string {
    return this.configService.get('BUCKET_NAME');
  }

  get rabbitMQ(): string {
    return this.configService.get('RABBIT_MQ');
  }

  get mongoDB(): string {
    return this.configService.get('MONGO_DB');
  }
}
