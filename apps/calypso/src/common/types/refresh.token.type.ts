import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenType {
  @ApiProperty({ type: 'string' })
  deviceId: string;
  @ApiProperty({ type: 'string', description: 'User ip' })
  ip: string;
  @ApiProperty({ type: 'string' })
  deviceName: string;
  @ApiProperty({ type: 'string' })
  userId: string;
  @ApiProperty({ type: 'string', description: 'Last visit' })
  dateCreate: Date;
}
