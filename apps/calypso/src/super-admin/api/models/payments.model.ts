import { AccountType, PaymentStatus, PaymentType } from '@prisma/client';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Payments' })
export class PaymentModel {
  @Field()
  paymentsId: string;
  @Field()
  userId: string;
  @Field(() => Int)
  price: number;
  @Field(() => String)
  paymentSystem: PaymentType;
  @Field(() => String)
  paymentStatus: PaymentStatus;
  @Field(() => Date, { nullable: true })
  createdAt: Date;
  @Field(() => String)
  subscriptionType: AccountType;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
  @Field(() => Date, { nullable: true })
  endDateOfSubscription?: Date;
}
