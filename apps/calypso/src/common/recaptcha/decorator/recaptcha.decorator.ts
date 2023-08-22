import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as process from 'process';

export const Recaptcha = createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const recaptchaToken = request.headers['recaptcha-value'];

    if (!recaptchaToken) {
      throw new HttpException(
        { message: 'RECAPTCHA token is missing' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const result = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        body: `secret=${secretKey}&response=${recaptchaToken}`,
      },
    );

    const response = await result.json();

    if (!response.data.success) {
      throw new HttpException(
        { message: 'Invalid RECAPTCHA token' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return response.success;
  },
);
