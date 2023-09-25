import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';

export class DeviceDto {
  @Transform(({ value }) => String(value).trim())
  @Length(1)
  @ApiProperty({ type: 'string' })
  deviceId: 'string';
}
