import { ApiConfigService } from '../helper/api.config.service';
import Stripe from 'stripe';
import { randomUUID } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsEntity } from '../../features/payments/entities/products.entity';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePaymentDataCommand } from '../../features/payments/aplication/use-case/update.payment.data.use.case';
import { DataPaymentsType } from '../../../../calypso/src/common/types/data.payments.type';

@Injectable()
export class StripeAdapter implements IPaymentAdapter {
  constructor(
    private apiConfigService: ApiConfigService,
    private command: CommandBus,
  ) {}

  async createPayment(
    productsData: ProductsEntity[],
  ): Promise<{ data: any; url: string; subscriptionTimeHours: number }> {
    const stripe = new Stripe(this.apiConfigService.stripeSecretKey, {
      apiVersion: '2023-08-16',
    });
    let subscriptionTimeHours = 0;
    const array = [];
    for (const product of productsData) {
      subscriptionTimeHours += product.subscriptionTimeHours * product.quantity;
      array.push({
        price_data: {
          product_data: { name: product.nameSubscription },
          currency: 'USD',
          unit_amount: product.price,
          // recurring: { interval: 'day' },
        },
        quantity: product.quantity,
      });
    }

    const session: Stripe.Response<Stripe.Checkout.Session> =
      await stripe.checkout.sessions.create({
        success_url: this.apiConfigService.successUrl,
        cancel_url: this.apiConfigService.cancelUrl,
        line_items: array,
        mode: 'payment',
        // subscription_data: {             тестил возможность подписки
        //   billing_cycle_anchor: Math.floor(Date.now() / 1000) + 86400,
        // },
        client_reference_id: 'pt_' + randomUUID(),
      });
    return {
      data: session,
      url: session.url,
      subscriptionTimeHours: subscriptionTimeHours,
    };
  }

  async validatePayment(req: any): Promise<void> {
    const stripe = new Stripe(this.apiConfigService.stripeSecretKey, {
      apiVersion: '2023-08-16',
    });
    const signature = req.headers['stripe-signature'];
    try {
      const event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        this.apiConfigService.signingSecret,
      );
      if (event.type === 'checkout.session.completed') {
        const data = event.data.object as Stripe.Checkout.Session;
        const dataPayment: DataPaymentsType = {
          paymentsId: data.client_reference_id,
          price: data.amount_total,
        };
        await this.command.execute(
          new UpdatePaymentDataCommand(data, dataPayment),
        );
      }
    } catch (err) {
      throw new BadRequestException({ field: 'webHook', message: err.message });
    }
  }
}
