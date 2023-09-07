import { Controller, Get } from '@nestjs/common';
import { PaymentsMicroserviceService } from './payments-microservice.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class PaymentsMicroserviceController {
  constructor(
    private readonly paymentsMicroserviceService: PaymentsMicroserviceService,
  ) {}

  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.paymentsMicroserviceService.getHello();
  }
}
