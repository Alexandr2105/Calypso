import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// @ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private httpService: HttpService) {}

  @Get('*')
  async forwardPaymentGetRequest(@Req() req) {
    return this.forwardPaymentRequest(req);
  }

  @Post('*')
  async forwardPaymentPostRequest(@Req() req) {
    return this.forwardPaymentRequest(req);
  }

  private async forwardPaymentRequest(req) {
    const url = `http://localhost:3002${req.path}`;

    // const url = `https://kustogram.site${req.path}`;

    const response2 = await firstValueFrom(
      this.httpService.request({
        url,
        method: req.method,
        data: { body: req.body, headers: req.headers },
        params: req.query,
      }),
    );

    console.log(response2.data);

    return url;
  }
}
