import { BadRequestException, Injectable } from '@nestjs/common';
import * as paypal from 'paypal-rest-sdk';
import { ProductsEntity } from '../../features/payments/entities/products.entity';
import { ApiConfigService } from '../helper/api.config.service';
import { UpdatePaymentDataCommand } from '../../features/payments/aplication/use-case/update.payment.data.use.case';
import { CommandBus } from '@nestjs/cqrs';
import { DataPaymentsType } from '../../../../calypso/src/common/types/data.payments.type';

@Injectable()
export class PaypalAdapter implements IPaymentAdapter {
  constructor(
    private apiConfigService: ApiConfigService,
    private command: CommandBus,
  ) {}

  async createPayment(
    productsData: ProductsEntity[],
  ): Promise<{ data: any; url: string; subscriptionTimeHours: number }> {
    let subscriptionTimeHours = 0;
    let totalPrice = 0;
    const array = [];
    for (const product of productsData) {
      subscriptionTimeHours += product.subscriptionTimeHours * product.quantity;
      totalPrice += product.price * product.quantity;
      array.push({
        name: product.nameSubscription,
        sku: product.idProduct,
        price: product.price / 100,
        currency: 'USD',
        quantity: product.quantity,
      });
    }
    paypal.configure({
      mode: 'sandbox',
      client_id: this.apiConfigService.clientIdForPaypal,
      client_secret: this.apiConfigService.clientSecretForPaypal,
    });
    const createPayment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: 'http://localhost:3002/api/v1/payments/success',
        cancel_url: 'http://localhost:3002/api/v1/payments/error',
      },
      transactions: [
        {
          item_list: {
            items: array,
          },
          amount: {
            currency: 'USD',
            total: totalPrice / 100,
          },
          description: 'Subscription',
        },
      ],
    };

    async function createPaypalPayment(createPayment) {
      return new Promise((resolve, reject) => {
        paypal.payment.create(createPayment, (err, payment) => {
          if (err) {
            reject(err);
          } else {
            resolve(payment);
          }
        });
      });
    }

    const payment: any = await createPaypalPayment(createPayment);
    return {
      data: payment,
      url: payment.links[1].href,
      subscriptionTimeHours: subscriptionTimeHours,
    };
  }

  async validatePayment(payment: any): Promise<void> {
    if (payment.id && payment.event_type === 'PAYMENTS.PAYMENT.CREATED') {
      const dataPayments: DataPaymentsType = {
        paymentsId: payment.resource.id,
        price: 0,
      };
      await this.command.execute(
        new UpdatePaymentDataCommand(payment, dataPayments),
      );
    } else {
      throw new BadRequestException({
        field: 'paypal',
        message: 'Bad request',
      });
    }
  }
}
