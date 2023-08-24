import { ApiProperty } from '@nestjs/swagger';

export class IdForCursorDto {
  @ApiProperty({
    description: 'If the request is the first then postId="0"',
    type: 'string',
  })
  postId: string;
}
