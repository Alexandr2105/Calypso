import { AccountType, PaymentType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentsTypeForSwagger {
  @ApiProperty({ type: 'string', description: 'Subscription payment date' })
  dateOfPayments: Date;
  @ApiProperty({ type: 'string', description: 'Date end of subscription' })
  endDateOfSubscription: Date;
  @ApiProperty({ type: 'number', description: 'Subscription cost' })
  price: number;
  @ApiProperty({ type: 'string', description: 'Subscription type' })
  subscriptionType: AccountType;
  @ApiProperty({ type: 'string', description: 'Payment service' })
  paymentType: PaymentType;
}
