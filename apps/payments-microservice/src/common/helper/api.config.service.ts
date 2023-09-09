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

  get successUrl(): string {
    return this.configService.get('SUCCESS_URL');
  }

  get cancelUrl(): string {
    return this.configService.get('CANCEL_URL');
  }

  get clientIdForPaypal(): string {
    return this.configService.get('CLIENT_ID');
  }

  get clientSecretForPaypal(): string {
    return this.configService.get('CLIENT_SECRET');
  }
}
