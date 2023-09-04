import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PaymentManager {
  adapters: Partial<Record<PaymentSystemType, IPaymentAdapter>> = {};

  constructor(
    @Inject('PaypalAdapter') private readonly paypalAdapter: IPaymentAdapter,
    @Inject('StripeAdapter') private readonly stripeAdapter: IPaymentAdapter,
  ) {
    this.adapters[PaymentSystemType.Stripe] = stripeAdapter;
    this.adapters[PaymentSystemType.Paypal] = paypalAdapter;
  }
}

enum PaymentSystemType {
  Paypal = 'paypal',
  Stripe = 'stripe',
}
