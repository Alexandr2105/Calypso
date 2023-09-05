import { ApiConfigService } from '../helper/api.config.service';
import Stripe from 'stripe';
import { randomUUID } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsEntity } from '../../features/payments/entities/products.entity';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePaymentDataCommand } from '../../features/payments/aplication/use-case/update.payment.data.use.case';

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

    let money = 0;
    let subscriptionTimeHours = 0;
    for (const product of productsData) {
      money += product.price * product.quantity;
      subscriptionTimeHours += product.subscriptionTimeHours * product.quantity;
    }

    const session: Stripe.Response<Stripe.Checkout.Session> =
      await stripe.checkout.sessions.create({
        success_url: 'http://localhost:3002/payments/success',
        cancel_url: 'http://localhost:3002/payments/error',
        line_items: [
          {
            price_data: {
              product_data: { name: 'Subscription' },
              currency: 'USD',
              unit_amount: money,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        client_reference_id: 'pt_' + randomUUID(),
      });
    return {
      data: session,
      url: session.url,
      subscriptionTimeHours: subscriptionTimeHours,
    };
  }

  async validatePayment(req: any): Promise<{ data: any }> {
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
        const dataPayment = event.data.object as Stripe.Checkout.Session;
        const data = await this.command.execute(
          new UpdatePaymentDataCommand(dataPayment),
        );
      }
    } catch (err) {
      throw new BadRequestException({ field: 'webHook', message: err.message });
    }
    return { data: undefined };
  }
}
