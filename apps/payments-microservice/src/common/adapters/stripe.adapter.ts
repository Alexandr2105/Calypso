import { ApiConfigService } from '../helper/api.config.service';
import Stripe from 'stripe';
import { randomUUID } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsEntity } from '../../features/payments/entities/products.entity';

@Injectable()
export class StripeAdapter implements IPaymentAdapter {
  constructor(private apiConfigService: ApiConfigService) {}

  async createPayment(
    productsData: ProductsEntity[],
  ): Promise<{ data: any; url: string }> {
    const stripe = new Stripe(this.apiConfigService.stripeSecretKey, {
      apiVersion: '2023-08-16',
    });

    let quantity = 0;
    let money;
    for (const product of productsData) {
      money = +product.price;
      quantity++;
    }

    const session = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3002/payments/success',
      cancel_url: 'http://localhost:3002/payments/error',
      line_items: [
        {
          price_data: {
            product_data: { name: 'Subscription' },
            currency: 'USD',
            unit_amount: money,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      client_reference_id: 'pt_' + randomUUID(),
    });
    console.log(session);
    return { data: session, url: session.url };
  }

  async validatePayment(payment: any): Promise<{ data: any }> {
    const stripe = new Stripe(this.apiConfigService.stripeSecretKey, {
      apiVersion: '2023-08-16',
    });
    // const signature = req.headers['stripe-signature'];
    try {
      // const event = stripe.webhooks.constructEvent(
      //   req.rawBody,
      //   signature,
      //   this.apiConfigService.signingSecret,
      // );
      // if (event.type === 'checkout.session.completed') {
      //   const dataPayment = event.data.object as Stripe.Checkout.Session;
      //   console.log('=====================');
      //   console.log(dataPayment);
      //   console.log('+++++++++++++++++++++');
      //   console.log(dataPayment.client_reference_id);
      // }
    } catch (err) {
      console.log('ERRORS');
      throw new BadRequestException({ field: 'webHook', message: err.message });
    }
    return { data: undefined };
  }
}
