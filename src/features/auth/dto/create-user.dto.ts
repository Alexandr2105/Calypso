import { IsEmail, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxLengthPassword,
  maxLengthUserName,
  minLengthPassword,
  minLengthUserName,
} from '../../../common/constants/models.constants';

export class CreateUserDto {
  @Length(minLengthUserName, maxLengthUserName, {
    message: 'Не верно заполнено поле',
  })
  @Transform(({ value }) => value.trim())
  // @Validate(CheckOriginalLogin)
  @ApiProperty({
    type: 'string',
    minimum: minLengthUserName,
    maximum: maxLengthUserName,
  })
  login: string;

  @IsEmail()
  @Transform(({ value }) => value.trim())
  @ApiProperty({ type: 'string' })
  // @Validate(CheckOriginalEmail)
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
