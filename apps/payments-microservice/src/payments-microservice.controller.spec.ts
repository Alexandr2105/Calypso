import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsMicroserviceController } from './payments-microservice.controller';
import { PaymentsMicroserviceService } from './payments-microservice.service';

describe('PaymentsMicroserviceController', () => {
  let paymentsMicroserviceController: PaymentsMicroserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsMicroserviceController],
      providers: [PaymentsMicroserviceService],
    }).compile();

    paymentsMicroserviceController = app.get<PaymentsMicroserviceController>(
      PaymentsMicroserviceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(paymentsMicroserviceController.getHello()).toBe('Hello World!');
    });
  });
});
