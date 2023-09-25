import { ApiProperty } from '@nestjs/swagger';

export class DeviceInfoDto {
  @ApiProperty({ type: 'string' })
  browserName: string;
  @ApiProperty({ type: 'string' })
  deviceName: string;
  @ApiProperty({ type: 'string' })
  ip: string;
}
