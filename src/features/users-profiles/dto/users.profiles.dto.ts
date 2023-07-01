import { Length } from 'class-validator';
import {
  maxLengthUserName,
  minLengthUserName,
} from '../../../common/constants/models.constants';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UsersProfilesDto {
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

  @Transform(({ value }) => String(value).trim())
  @Length(0, 50, {
    message: 'Wrong length',
  })
  @ApiProperty({
    type: 'string',
    maximum: 50,
  })
  firstName: string;

  @Transform(({ value }) => String(value).trim())
  @Length(0, 50, {
    message: 'Wrong length',
  })
  @ApiProperty({
    type: 'string',
    maximum: 50,
  })
  lastName: string;

  @Transform(({ value }) => String(value).trim())
  // @IsDate({ message: 'Wrong date' })
  @ApiProperty({
    type: 'string',
  })
  dateOfBirthday: string;

  @Transform(({ value }) => String(value).trim())
  @Length(0, 50, {
    message: 'Wrong length',
  })
  @ApiProperty({
    type: 'string',
    maximum: 50,
  })
  city: string;

  @Transform(({ value }) => String(value).trim())
  @Length(0, 200, {
    message: 'Wrong length',
  })
  @ApiProperty({
    type: 'string',
    maximum: 200,
  })
  userInfo: string;
}
