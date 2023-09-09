import { ApiProperty } from '@nestjs/swagger';

export class UrlForSwaggerType {
  @ApiProperty({ type: 'string', description: 'Payment link' })
  url: 'string';
}
