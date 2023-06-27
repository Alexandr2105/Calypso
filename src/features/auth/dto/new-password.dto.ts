import { Transform } from 'class-transformer';
import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxLengthPassword,
  minLengthPassword,
} from '../../../common/constants/models.constants';

export class NewPasswordDto {
  @Transform(({ value }) => value.trim())
  @ApiProperty({ type: 'string', minimum: 6, maximum: 20 })
  @Length(minLengthPassword, maxLengthPassword, {
    message: 'Не верно заполнено поле',
  })
  newPassword: string;

  @Transform(({ value }) => value.trim())
  @ApiProperty({ type: 'string' })
  // @Validate(CheckRecoveryCode)
  recoveryCode: string;
}
