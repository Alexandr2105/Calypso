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
import { GetCurrentSubscriptionCommand } from '../aplication/use-case/get.current.subscription.use.case';
import { SubscriptionForSwaggerType } from '../../../common/types/subscription.for.swagger.type';
import { QueryHelper } from '../../../../../../libraries/helpers/query.helper';
import { QueryRepository } from '../../query-repository/query.repository';
import { PaymentsQueryType } from '../../../common/query-types/payments.query.type';

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
  async getSubscriptions() {
    return this.commandBus.execute(new GetAllSubscriptionsCommand());
  }

  @ApiOperation({ summary: 'All subscriptions for current user' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: SubscriptionForSwaggerType })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @Get('current-subscription')
  async getCurrentUserSubscription(@Body('userId') userId: string) {
    return this.commandBus.execute(new GetCurrentSubscriptionCommand(userId));
  }

  @Get('payments')
  async getPaymentsCurrentUser(
    @Body('userId') userId: string,
    @Query() query,
  ): Promise<PaymentsQueryType> {
    const queryParam = this.queryHelper.queryParamHelper(query);
    return this.queryRepository.getPaymentsCurrentUser(userId, queryParam);
  }
}
