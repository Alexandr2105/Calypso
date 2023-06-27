import { Transform } from 'class-transformer';
import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxLengthPassword,
  minLengthPassword,
} from '../../../common/constants/models.constants';

export class NewPasswordDto {
  @Transform(({ value }) => value.trim())
  @Length(minLengthPassword, maxLengthPassword, {
    message: 'Не верно заполнено поле',
  })
  @ApiProperty({ type: 'string', minimum: 6, maximum: 20 })
  newPassword: string;

  @Transform(({ value }) => value.trim())
  @ApiProperty()
  // @Validate(CheckRecoveryCode)
  recoveryCode: string;
}
