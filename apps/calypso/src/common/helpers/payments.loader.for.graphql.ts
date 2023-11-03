import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';
import { PaymentModel } from '../../super-admin/api/models/payments.model';
import { ApiConfigService } from './api.config.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PaymentsLoaderForGraphql
  implements NestDataLoader<string, PaymentModel>
{
  constructor(
    private httpService: HttpService,
    private apiConfigService: ApiConfigService,
  ) {}

  generateDataLoader(): DataLoader<string, PaymentModel | null> {
    return new DataLoader<string, PaymentModel | null>(
      async (usersIds: string[]) => {
        const url = `${
          this.apiConfigService.paymentsMicroservice +
          '/api/v1/payments/allPaymentsForUsers'
        }`;
        // const url = 'http://localhost:3002/api/v1/payments/allPaymentsForUsers';
        const response = await firstValueFrom(
          this.httpService.request({
            url,
            method: 'GET',
            data: usersIds,
          }),
        );
        return usersIds.map((id) => {
          return (
            response.data.filter((payment) => payment.userId === id) || null
          );
        });
      },
    );
  }
}
