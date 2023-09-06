import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get addressSiteForConfirmation(): string {
    return this.configService.get('ADDRESS_SITE_FOR_CONFIRMATION');
  }

  get recaptchaSecretKey(): string {
    return this.configService.get('RECAPTCHA_SECRET_KEY');
  }

  get rabbitMQ(): string {
    return this.configService.get('RABBIT_MQ');
  }

  get googleId(): string {
    return this.configService.get('GOOGLE_ID');
  }

  get googleSecret(): string {
    return this.configService.get('GOOGLE_SECRET');
  }

  get googleRedirectUrl(): string {
    return this.configService.get('GOOGLE_REDIRECT_URL');
  }

  get githubId(): string {
    return this.configService.get('GITHUB_ID');
  }

  get githubSecret(): string {
    return this.configService.get('GITHUB_SECRET');
  }

  get githubRedirectUrl(): string {
    return this.configService.get('GITHUB_REDIRECT_URL');
  }

  get nodeMailerUser(): string {
    return this.configService.get('NODEMAILER_USER');
  }

  get nodeMailerPassword(): string {
    return this.configService.get('NODEMAILER_PASSWORD');
  }

  get paymentsMicroservice(): string {
    return this.configService.get('PAYMENTS_MICROSERVICE');
  }
}
