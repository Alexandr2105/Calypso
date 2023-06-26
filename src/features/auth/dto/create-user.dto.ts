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
    message: 'Не верно заполнено поле',
  })
  @Transform(({ value }) => value.trim())
  @Validate(CheckLoginOrEmailInDb)
  @ApiProperty({
    type: 'string',
    minimum: minLengthUserName,
    maximum: maxLengthUserName,
  })
  login: string;

  @IsEmail()
  @Transform(({ value }) => value.trim())
  @ApiProperty({ type: 'string' })
  @Validate(CheckLoginOrEmailInDb)
  email: string;

  @Transform(({ value }) => value.trim())
  @Length(minLengthPassword, maxLengthPassword, {
    message: 'Не верно заполнено поле',
  })
  @ApiProperty({
    type: 'string',
    minimum: minLengthPassword,
    maximum: maxLengthPassword,
  })
  password: string;
}
