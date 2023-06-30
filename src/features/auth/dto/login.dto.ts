import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import {
  maxLengthPassword,
  maxLengthLoginOrEmail,
  minLengthPassword,
  minLengthLoginOrEmail,
} from '../../../common/constants/models.constants';

export class LoginDto {
  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ type: 'string' })
  @Length(minLengthLoginOrEmail, maxLengthLoginOrEmail, {
    message: 'Wrong length',
  })
  loginOrEmail: string;

  @Transform(({ value }) => String(value).trim())
  @ApiProperty({ type: 'string' })
  @Length(minLengthPassword, maxLengthPassword, { message: 'Wrong length' })
  password: string;
}
