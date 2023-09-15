import {
  AccountType,
  PaymentStatus,
  PaymentType,
  Prisma,
} from '@prisma/client';

export class PaymentsEntity {
  paymentsId: string;
  userId: string;
  price: number;
  paymentSystem: PaymentType;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  allDataPayment: Prisma.JsonValue;
  subscriptionType: AccountType;
  updatedAt?: Date;
  endDateOfSubscription?: Date;
  allDataPaymentConfirm?: Prisma.JsonValue;

  constructor(
    paymentsId: string,
    userId: string,
    price: number,
    paymentSystem: PaymentType,
    paymentStatus: PaymentStatus,
    createdAt: Date,
    allDataPayment: Prisma.JsonValue,
    subscriptionType: AccountType,
    updatedAt: Date,
    endDateOfSubscription: Date,
    allDataPaymentConfirm: Prisma.JsonValue,
  ) {
    this.paymentsId = paymentsId;
    this.userId = userId;
    this.price = price;
    this.paymentSystem = paymentSystem;
    this.paymentStatus = paymentStatus;
    this.createdAt = createdAt;
    this.allDataPayment = allDataPayment;
    this.subscriptionType = subscriptionType;
    this.updatedAt = updatedAt;
    this.endDateOfSubscription = endDateOfSubscription;
    this.allDataPaymentConfirm = allDataPaymentConfirm;
  }
}
