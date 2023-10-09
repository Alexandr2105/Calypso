import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaginationDto } from '../../api/dto/pagination.dto';
import { PaymentModel } from '../../api/models/payments.model';
import { HttpService } from '@nestjs/axios';
import { ApiConfigService } from '../../../common/helpers/api.config.service';
import { firstValueFrom } from 'rxjs';

export class GetAllPaymentsCommand {
  constructor(public data: PaginationDto) {}
}

@CommandHandler(GetAllPaymentsCommand)
export class GetAllPaymentsUseCase
  implements ICommandHandler<GetAllPaymentsCommand>
{
  constructor(
    private httpService: HttpService,
    private apiConfigService: ApiConfigService,
  ) {}

  async execute(command: GetAllPaymentsCommand): Promise<PaymentModel> {
    const url = `${
      this.apiConfigService.paymentsMicroservice +
      '/api/v1/payments/allPayments'
    }`;

    // const url = 'http://localhost:3002/api/v1/payments/allPayments';

    const response = await firstValueFrom(
      this.httpService.request({
        url,
        method: 'GET',
        data: command.data,
      }),
    );
    return response.data;
  }
}
