import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get stripeSecretKey(): string {
    return this.configService.get('STRIPE_SECRET_KEY');
  }

  get signingSecret(): string {
    return this.configService.get('SIGNING_SECRET');
  }

  get success_url(): string {
    return this.configService.get('SUCCESS_URL');
  }

  get cancel_url(): string {
    return this.configService.get('CANCEL_URL');
  }
}
