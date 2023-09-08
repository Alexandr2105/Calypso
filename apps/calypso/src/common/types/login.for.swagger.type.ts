import { ApiProperty } from '@nestjs/swagger';

export class LoginForSwaggerType {
  @ApiProperty({
    type: 'string',
    description: 'Access token for authentication.',
  })
  accessToken: string;
  @ApiProperty({
    type: 'boolean',
    description: 'Indicates if a profile exists.',
  })
  profile: boolean;
}
