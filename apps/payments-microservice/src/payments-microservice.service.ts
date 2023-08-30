import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
