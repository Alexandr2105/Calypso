import { AccountType, PaymentType } from '@prisma/client';

export class PaymentsType {
  dateOfPayments: Date;
  endDateOfSubscription: Date;
  price: number;
  subscriptionType: AccountType;
  paymentType: PaymentType;
}
