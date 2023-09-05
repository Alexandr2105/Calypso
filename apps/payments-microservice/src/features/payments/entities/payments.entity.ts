import { PaymentStatus, PaymentType, Prisma } from '@prisma/client';

export class PaymentsEntity {
  paymentsId: string;
  userId: string;
  price: number;
  paymentSystem: PaymentType;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  allDataPayment: Prisma.JsonValue;
  updatedAt?: Date;
  allDataPaymentConfirm?: Prisma.JsonValue;

  constructor(
    paymentsId: string,
    userId: string,
    price: number,
    paymentSystem: PaymentType,
    paymentStatus: PaymentStatus,
    createdAt: Date,
    updatedAt: Date,
    allDataPayment: Prisma.JsonValue,
    allDataPaymentConfirm: Prisma.JsonValue,
  ) {
    this.paymentsId = paymentsId;
    this.userId = userId;
    this.price = price;
    this.paymentSystem = paymentSystem;
    this.paymentStatus = paymentStatus;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.allDataPayment = allDataPayment;
    this.allDataPaymentConfirm = allDataPaymentConfirm;
  }
}
