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
  @Transform(({ value }) => value.trim())
  @ApiProperty({ type: 'string' })
  @Length(minLengthLoginOrEmail, maxLengthLoginOrEmail)
  loginOrEmail: string;

  @Transform(({ value }) => value.trim())
  @ApiProperty({ type: 'string' })
  @Length(minLengthPassword, maxLengthPassword)
  password: string;
}
