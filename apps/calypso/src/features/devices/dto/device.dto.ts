import { ApiProperty } from '@nestjs/swagger';

export class DeviceDto {
  @ApiProperty({ type: 'string' })
  deviceId: 'string';
}
