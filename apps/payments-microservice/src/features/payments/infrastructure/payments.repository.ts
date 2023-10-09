import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma-service';
import { PaymentsEntity } from '../entities/payments.entity';
import { ProductsEntity } from '../entities/products.entity';
import { AccountType, PaymentStatus, Prisma } from '@prisma/client';
import { SubscriptionsEntity } from '../entities/subscriptions.entity';

@Injectable()
export class PaymentsRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async getProductById(id: string): Promise<ProductsEntity> {
    return this.prisma.products.findUnique({ where: { idProduct: id } });
  }

  async savePayment(
    payment: PaymentsEntity,
    subscription: SubscriptionsEntity,
  ): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.payments.create({ data: payment });
      await prisma.subscriptions.create({ data: subscription });
    });
  }

  async updatePayment(
    paymentsId: string,
    allDataPaymentConfirm: Prisma.JsonValue,
    updatedAt: Date,
    paymentStatus: PaymentStatus,
    endDateOfSubscription: Date,
  ) {
    let infoPayment: SubscriptionsEntity;
    await this.prisma.$transaction(async (prisma) => {
      await prisma.payments.update({
        where: { paymentsId: paymentsId },
        data: {
          paymentStatus: paymentStatus,
          allDataPaymentConfirm: allDataPaymentConfirm,
          updatedAt: updatedAt,
          endDateOfSubscription: endDateOfSubscription,
        },
      });
      infoPayment = await prisma.subscriptions.update({
        where: { paymentsId: paymentsId },
        data: {
          paymentsType: paymentStatus,
          dateOfPayments: updatedAt,
          endDateOfSubscription: endDateOfSubscription,
        },
      });
    });
    return infoPayment;
  }

  async getSubscriptionByPaymentsId(
    paymentsId: string,
  ): Promise<SubscriptionsEntity> {
    return this.prisma.subscriptions.findUnique({
      where: { paymentsId: paymentsId },
    });
  }

  async getProductsSubscriptions() {
    return this.prisma.products.findMany({
      select: { idProduct: true, price: true, nameSubscription: true },
    });
  }

  async getSubscriptionCurrentUser(userId): Promise<SubscriptionsEntity> {
    return this.prisma.subscriptions.findUnique({
      where: { userId: userId },
    });
  }

  async cretePaymentAndUpdateSubscription(
    payment: PaymentsEntity,
    subscription: SubscriptionsEntity,
  ) {
    await this.prisma.$transaction(async (prisma) => {
      await prisma.payments.create({ data: payment });
      await prisma.subscriptions.update({
        where: { userId: subscription.userId },
        data: subscription,
      });
    });
  }

  async getOldSubscriptions(date: Date): Promise<SubscriptionsEntity[]> {
    return this.prisma.subscriptions.findMany({
      where: {
        endDateOfSubscription: { lte: date },
        subscriptionType: 'Business',
      },
    });
  }

  async updateSubscriptionType(
    userId: string,
    type: AccountType,
  ): Promise<void> {
    await this.prisma.subscriptions.update({
      where: { userId: userId },
      data: { subscriptionType: type },
    });
  }

  async getAllPaymentForUsers(users: string[]) {
    return this.prisma.payments.findMany({ where: { userId: { in: users } } });
  }

  async getAllPaymentsCount() {
    return this.prisma.payments.count();
  }
}
