import { ApiProperty } from '@nestjs/swagger';

export class OauthCodeDto {
  @ApiProperty({ type: 'string' })
  code: string;
}
