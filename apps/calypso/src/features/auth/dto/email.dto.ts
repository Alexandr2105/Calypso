import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({ type: 'string' })
  email: string;
  @ApiProperty({ type: 'string' })
  password: string;
  @ApiProperty({ type: 'string' })
  browserName: string;
  @ApiProperty({ type: 'string' })
  deviceName: string;
  @ApiProperty({ type: 'string' })
  ip: string;
}
