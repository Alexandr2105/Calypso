import { IsEmail, Length, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxLengthPassword,
  maxLengthUserName,
  minLengthPassword,
  minLengthUserName,
} from '../../../common/constants/models.constants';
import { CheckLoginOrEmailInDb } from '../../users/validation/check-login-or-email-in-db';

export class CreateUserDto {
  @Length(minLengthUserName, maxLengthUserName, {
    message: 'Wrong length',
  })
  @Transform(({ value }) => String(value).trim())
  // @Validate(CheckLoginOrEmailInDb)
  @ApiProperty({
    type: 'string',
    minimum: minLengthUserName,
    maximum: maxLengthUserName,
  })
  login: string;

  @IsEmail()
  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ type: 'string' })
  @Validate(CheckLoginOrEmailInDb)
  email: string;

  @Transform(({ value }) => String(value).trim())
  @Length(minLengthPassword, maxLengthPassword, {
    message: 'Wrong length',
  })
  @ApiProperty({
    type: 'string',
    minimum: minLengthPassword,
    maximum: maxLengthPassword,
  })
  password: string;
}
