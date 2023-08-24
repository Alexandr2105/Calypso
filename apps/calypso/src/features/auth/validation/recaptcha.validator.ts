import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { settings } from '../../../settings';

@ValidatorConstraint({ name: 'recaptchaValidator', async: true })
@Injectable()
export class RecaptchaValidator implements ValidatorConstraintInterface {
  async validate(value: any): Promise<boolean> {
    const secretKey = settings.RECAPTCHA_SECRET_KEY;

    const result = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: `secret=${secretKey}&response=${value}`,
      },
    );

    const response = await result.json();

    return response.success;
  }

  defaultMessage(): string {
    return 'Incorrect recaptcha code';
  }
}
