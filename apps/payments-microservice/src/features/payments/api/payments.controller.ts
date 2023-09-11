import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Query,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ApiConfigService } from '../../../common/helper/api.config.service';
import { RawBodyRequest } from '@nestjs/common';
import { PaymentManager } from '../../../common/managers/payment.manager';
import { PaymentsDto } from '../dto/payments.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CheckProductInDbCommand } from '../aplication/use-case/check.product.in.db.use.case';
import { SavePaymentsDataCommand } from '../aplication/use-case/save.payments.data.use.case';
import { DataPaymentsType } from '../../../common/types/data.payments.type';
import { GetAllSubscriptionsCommand } from '../aplication/use-case/get.all.subscriptions.use.case';
import { GetCurrentSubscriptionCommand } from '../aplication/use-case/get.current.subscription.use.case';
import { QueryHelper } from '../../../../../../libraries/helpers/query.helper';
import { QueryRepository } from '../../query-repository/query.repository';
import { PaymentsQueryType } from '../../../common/query-types/payments.query.type';
import {
  SwaggerDecoratorByGetCurrentSubscriptions,
  SwaggerDecoratorByGetPayments,
  SwaggerDecoratorByGetSubscriptions,
  SwaggerDecoratorByPostPaypal,
  SwaggerDecoratorByPostStripe,
} from '../swagger/swagger.payments.decorators';

@ApiTags('Payments')
@Controller('/payments')
export class PaymentsController {
  constructor(
    private apiConfigService: ApiConfigService,
    private paymentManager: PaymentManager,
    private commandBus: CommandBus,
    private queryRepository: QueryRepository,
    private queryHelper: QueryHelper,
  ) {}

  @SwaggerDecoratorByPostStripe()
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

  @SwaggerDecoratorByPostPaypal()
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

  @SwaggerDecoratorByGetSubscriptions()
  @Get('subscriptions')
  async getSubscriptions() {
    return this.commandBus.execute(new GetAllSubscriptionsCommand());
  }

  @SwaggerDecoratorByGetCurrentSubscriptions()
  @Get('current-subscription')
  async getCurrentUserSubscription(@Body('userId') userId: string) {
    return this.commandBus.execute(new GetCurrentSubscriptionCommand(userId));
  }

  @SwaggerDecoratorByGetPayments()
  @Get('payments')
  async getPaymentsCurrentUser(
    @Body('userId') userId: string,
    @Query() query,
  ): Promise<PaymentsQueryType> {
    const queryParam = this.queryHelper.queryParamHelper(query);
    return this.queryRepository.getPaymentsCurrentUser(userId, queryParam);
  }
}
