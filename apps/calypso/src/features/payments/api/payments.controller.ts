import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { All } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private httpService: HttpService) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  @All('*')
  private async forwardPaymentRequest(@Req() req, @Body() body) {
    // const url = `http://localhost:3002${req.path}`;
    const url = `http://localhost:3002/payments/get`;
    const response = await firstValueFrom(
      this.httpService.request({
        url,
        method: req.method,
        params: req.query,
        data: { body: body, userId: req.user.id },
      }),
    );
    return response.data;
  }
}
