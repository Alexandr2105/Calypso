import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiConfigService } from '../../../common/helper/api.config.service';
import { HttpStatus, RawBodyRequest } from '@nestjs/common';
import { PaymentManager } from '../../../common/managers/payment.manager';
import { PaymentsDto } from '../dto/payments.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CheckProductInDbCommand } from '../aplication/use-case/check.product.in.db.use.case';
import { SavePaymentsDataCommand } from '../aplication/use-case/save.payments.data.use.case';
import { DataPaymentsType } from '../../../common/types/data.payments.type';
import { UrlForSwaggerType } from '../../../common/types/url.for.swagger.type';
import { ErrorsMessageForSwaggerType } from '../../../common/types/errors.message.for.swagger.type';
import { GetAllSubscriptionsCommand } from '../aplication/use-case/get.all.subscriptions.use.case';
import { ProductsEntity } from '../entities/products.entity';

@ApiTags('Payments')
@Controller('/payments')
export class PaymentsController {
  constructor(
    private apiConfigService: ApiConfigService,
    private paymentManager: PaymentManager,
    private commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Payment by stipe' })
  @ApiBody({ type: [PaymentsDto] })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UrlForSwaggerType,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Products not found',
  })
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

  @ApiExcludeEndpoint()
  @Get('success')
  async postInfo() {
    return 'All right';
  }

  @ApiExcludeEndpoint()
  @Get('error')
  async error() {
    return 'All bad';
  }

  @ApiExcludeEndpoint()
  @Post('stripeHook')
  async getStripeHook(@Req() req: RawBodyRequest<Request>) {
    await this.paymentManager.adapters.stripe.validatePayment(req);
  }

  @ApiOperation({ summary: 'Payment by paypal' })
  @ApiBearerAuth()
  @ApiBody({ type: [PaymentsDto] })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UrlForSwaggerType,
  })
  @ApiResponse({ type: ErrorsMessageForSwaggerType })
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

  @ApiExcludeEndpoint()
  @Post('paypalHook')
  async getPaypalHook(@Body() body) {
    await this.paymentManager.adapters.paypal.validatePayment(body);
  }

  @ApiOperation({ summary: 'All subscriptions' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [ProductsEntity] })
  @Get('subscriptions')
  async getCurrentUserSubscription() {
    return this.commandBus.execute(new GetAllSubscriptionsCommand());
  }
}
