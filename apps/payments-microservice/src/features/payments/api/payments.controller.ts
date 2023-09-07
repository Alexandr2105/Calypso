import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ApiConfigService } from '../../../common/helper/api.config.service';
import { RawBodyRequest } from '@nestjs/common';
import { PaymentManager } from '../../../common/managers/payment.manager';
import { PaymentsDto } from '../dto/payments.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CheckProductInDbCommand } from '../aplication/use-case/check.product.in.db.use.case';
import { SavePaymentsDataCommand } from '../aplication/use-case/save.payments.data.use.case';
import { DataPaymentsType } from '../../../../../calypso/src/common/types/data.payments.type';

@ApiTags('Payments')
@Controller('/payments')
export class PaymentsController {
  constructor(
    private apiConfigService: ApiConfigService,
    private paymentManager: PaymentManager,
    private commandBus: CommandBus,
  ) {}

  @Post('stripe')
  async createStripePayment(
    @Body('body') body: PaymentsDto[],
    @Body('userId') userId: string,
  ) {
    const products = await this.commandBus.execute(
      new CheckProductInDbCommand(body),
    );
    const data = await this.paymentManager.adapters.stripe.createPayment(
      products,
    );
    const dataPayments: DataPaymentsType = {
      paymentsId: data.data.client_reference_id,
      price: data.data.amount_total,
    };
    await this.commandBus.execute(
      new SavePaymentsDataCommand(
        data.data,
        dataPayments,
        userId,
        'Stripe',
        data.subscriptionTimeHours,
      ),
    );
    return data.url;
  }

  @Get('success')
  async postInfo() {
    return 'All right';
  }

  @Get('error')
  async error() {
    return 'All bad';
  }

  @Post('stripeHook')
  async getStripeHook(@Req() req: RawBodyRequest<Request>) {
    await this.paymentManager.adapters.stripe.validatePayment(req);
  }

  @Post('paypal')
  async createPaypalPayment(
    @Body('body') body: PaymentsDto[],
    @Body('userId') userId: string,
  ) {
    const products = await this.commandBus.execute(
      new CheckProductInDbCommand(body),
    );
    const data = await this.paymentManager.adapters.paypal.createPayment(
      products,
    );
    const dataPayments: DataPaymentsType = {
      paymentsId: data.data.id,
      price: data.data.transactions[0].amount.total * 100,
    };
    await this.commandBus.execute(
      new SavePaymentsDataCommand(
        data.data,
        dataPayments,
        userId,
        'Paypall',
        data.subscriptionTimeHours,
      ),
    );
    return data.url;
  }

  @Post('paypalHook')
  async getPaypalHook(@Body() body) {
    await this.paymentManager.adapters.paypal.validatePayment(body);
  }
}
