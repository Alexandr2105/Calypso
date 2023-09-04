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
import { ApiTags } from '@nestjs/swagger';
import { ApiConfigService } from '../../../common/helper/api.config.service';
import { RawBodyRequest } from '@nestjs/common';
import { PaymentManager } from '../../../common/managers/payment.manager';
import { PaymentsDto } from '../dto/payments.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CheckProductInDbCommand } from '../aplication/use-case/check.product.in.db.use.case';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private apiConfigService: ApiConfigService,
    private paymentManager: PaymentManager,
    private commandBus: CommandBus,
  ) {}

  @Get('get')
  async getInfo(@Body() body: PaymentsDto, @Query() query) {
    console.log(query);
    const products = this.commandBus.execute(
      new CheckProductInDbCommand(body.productId),
    );
    await this.paymentManager.adapters.stripe.createPayment(products);
  }

  @Get('success')
  async postInfo(@Body() body, @Req() req) {
    return 'All right';
  }

  @Get('error')
  async error() {
    return 'All bad';
  }

  @Post('hook')
  async getHook(@Req() req: RawBodyRequest<Request>) {
    await this.paymentManager.adapters.paypal.validatePayment(req);
  }
}
