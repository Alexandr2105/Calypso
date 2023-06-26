import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailResendingDto {
  @Transform(({ value }) => value.trim())
  @IsEmail()
  @ApiProperty({ type: 'string' })
  // @Validate(CheckEmailConfirmation)
  email: string;
}
