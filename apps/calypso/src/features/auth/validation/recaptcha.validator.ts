import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../common/helpers/api.config.service';

@ValidatorConstraint({ name: 'recaptchaValidator', async: true })
@Injectable()
export class RecaptchaValidator implements ValidatorConstraintInterface {
  constructor(private apiConfigService: ApiConfigService) {}

  async validate(value: any): Promise<boolean> {
    console.log(value);
    const secretKey = this.apiConfigService.recaptchaSecretKey;

    console.log(secretKey);

    const result = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: `secret=${secretKey}&response=${value}`,
      },
    );

    const response = await result.json();

    console.log(response);

    return response.success;
  }

  defaultMessage(): string {
    return 'Incorrect recaptcha code';
  }
}
