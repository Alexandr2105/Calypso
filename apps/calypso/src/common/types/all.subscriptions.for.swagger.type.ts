import { ApiProperty } from '@nestjs/swagger';

export class AllSubscriptionsForSwaggerType {
  @ApiProperty({ type: 'string', description: "Subscription's id" })
  idProduct: string;
  @ApiProperty({ type: 'string', description: "Subscription's type" })
  nameSubscription: string;
  @ApiProperty({ type: 'number', description: "Subscription's price in cent" })
  price: number;
}
