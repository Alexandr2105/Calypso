import { Transform } from 'class-transformer';
import { IsEmail, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RecaptchaValidator } from '../validation/recaptcha.validator';

export class EmailResendingDto {
  @Transform(({ value }) => String(value).trim())
  @IsEmail({}, { message: 'Invalid email' })
  @ApiProperty({ type: 'string' })
  email: string;
  @ApiProperty({ type: 'string' })
  @Validate(RecaptchaValidator)
  recaptchaValue: string;
}
