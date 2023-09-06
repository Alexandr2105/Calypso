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

@ApiTags('Payments')
@Controller('api/v1/payments')
export class PaymentsController {
  constructor(
    private apiConfigService: ApiConfigService,
    private paymentManager: PaymentManager,
    private commandBus: CommandBus,
  ) {}

  @Post('stripe')
  async getInfo(
    @Body('body') body: PaymentsDto[],
    @Body('userId') userId: string,
  ) {
    const products = await this.commandBus.execute(
      new CheckProductInDbCommand(body),
    );
    const data = await this.paymentManager.adapters.stripe.createPayment(
      products,
    );
    await this.commandBus.execute(
      new SavePaymentsDataCommand(
        data.data,
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
  async getHook(@Req() req: RawBodyRequest<Request>) {
    await this.paymentManager.adapters.stripe.validatePayment(req);
  }
}
