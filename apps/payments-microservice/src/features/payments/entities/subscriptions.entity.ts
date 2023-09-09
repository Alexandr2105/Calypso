import { AccountType, PaymentStatus } from '@prisma/client';

export class SubscriptionsEntity {
  userId: string;
  paymentsId: string;
  dateOfPayments?: Date;
  endDateOfSubscription?: Date;
  price: number;
  subscriptionType: AccountType;
  paymentsType: PaymentStatus;
  theAmountOfHours: number;

  constructor(
    userId: string,
    paymentsId: string,
    dateOfPayments: Date,
    endDateOfSubscription: Date,
    price: number,
    subscriptionType: AccountType,
    paymentsType: PaymentStatus,
    theAmountOfHours: number,
  ) {
    this.userId = userId;
    this.paymentsId = paymentsId;
    this.dateOfPayments = dateOfPayments;
    this.endDateOfSubscription = endDateOfSubscription;
    this.price = price;
    this.subscriptionType = subscriptionType;
    this.paymentsType = paymentsType;
    this.theAmountOfHours = theAmountOfHours;
  }
}
