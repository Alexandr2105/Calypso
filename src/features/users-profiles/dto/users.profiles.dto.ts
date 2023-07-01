import { Length } from 'class-validator';
import {
  maxLengthUserName,
  minLengthUserName,
} from '../../../common/constants/models.constants';
import { Transform } from 'class-transformer';

export class UsersProfilesDto {
  @Transform(({ value }) => String(value).trim())
  @Length(minLengthUserName, maxLengthUserName, {
    message: 'Wrong length',
  })
  login: string;

  @Transform(({ value }) => String(value).trim())
  @Length(0, 50, {
    message: 'Wrong length',
  })
  firstName: string;

  @Transform(({ value }) => String(value).trim())
  @Length(0, 50, {
    message: 'Wrong length',
  })
  lastName: string;

  @Transform(({ value }) => String(value).trim())
  // @IsDate({ message: 'Wrong date' })
  dateOfBirthday: string;

  @Transform(({ value }) => String(value).trim())
  @Length(0, 50, {
    message: 'Wrong length',
  })
  city: string;

  @Transform(({ value }) => String(value).trim())
  @Length(0, 200, {
    message: 'Wrong length',
  })
  userInfo: string;
}
