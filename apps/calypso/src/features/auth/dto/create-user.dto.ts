import { IsEmail, Length, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxLengthPassword,
  maxLengthUserName,
  minLengthPassword,
  minLengthUserName,
} from '../../../common/constants/models.constants';
import { CheckEmailInDb } from '../../users/validation/check-email-in-db.service';

export class CreateUserDto {
  @Transform(({ value }) => String(value).trim())
  @Length(minLengthUserName, maxLengthUserName, {
    message: 'Wrong length',
  })
  @ApiProperty({
    type: 'string',
    minimum: minLengthUserName,
    maximum: maxLengthUserName,
  })
  login: string;

  @IsEmail(
    {
      require_tld: true,
      allow_utf8_local_part: false,
    },
    { message: 'Invalid email' },
  )
  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ type: 'string' })
  @Validate(CheckEmailInDb, {
    message: 'User with this email is already registered',
  })
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
