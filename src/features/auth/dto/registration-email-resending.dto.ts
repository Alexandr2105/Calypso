import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrationEmailResendingDto {
  @IsEmail()
  @ApiProperty({ type: 'string' })
  email: string;
}
