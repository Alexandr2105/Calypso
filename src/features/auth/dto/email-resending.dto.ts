import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailResendingDto {
  @Transform(({ value }) => String(value).trim())
  @IsEmail()
  @ApiProperty({ type: 'string' })
  // @Validate(CheckEmailConfirmation)
  email: string;
}
