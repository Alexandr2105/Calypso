import { AccountType, PaymentStatus } from '@prisma/client';

export type SubscriptionsType = {
  userId: string;
  paymentsId: string;
  dateOfPayments?: Date;
  endDateOfSubscription?: Date;
  price: number;
  subscriptionType: AccountType;
  paymentsType: PaymentStatus;
  theAmountOfHours: number;
};
