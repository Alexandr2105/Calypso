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
import Stripe from 'stripe';
import { ApiConfigService } from '../../common/helper/api.config.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private apiConfigService: ApiConfigService) {}

  @Get('get')
  async getInfo(@Body() body, @Req() req) {
    const stripe = new Stripe(this.apiConfigService.stripeSecretKey, {
      apiVersion: '2023-08-16',
    });

    const session = await stripe.checkout.sessions.create({
      success_url: 'http://localhos:3002/payments/success',
      cancel_url: 'http://localhost:3002/payments/error',
      line_items: [
        {
          price_data: {
            product_data: { name: 'Subscription' },
            currency: 'USD',
            unit_amount: 100 * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });
    console.log(session);
    return session;
  }

  @Get('success')
  async postInfo(@Body() body, @Req() req) {
    return 'All right';
  }

  @Get('error')
  async error() {
    return 'All bad';
  }
}
