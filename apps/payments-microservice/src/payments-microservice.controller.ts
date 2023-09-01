import { Controller, Get } from '@nestjs/common';
import { PaymentsMicroserviceService } from './payments-microservice.service';

@Controller()
export class PaymentsMicroserviceController {
  constructor(
    private readonly paymentsMicroserviceService: PaymentsMicroserviceService,
  ) {}

  @Get()
  getHello(): string {
    return this.paymentsMicroserviceService.getHello();
  }
}
