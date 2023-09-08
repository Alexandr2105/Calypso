import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionForSwaggerType {
  @ApiProperty({ type: 'string', description: 'Current user id' })
  userId: string;
  @ApiProperty({ type: 'string', description: 'End of subscription' })
  expireAt: Date;
}
