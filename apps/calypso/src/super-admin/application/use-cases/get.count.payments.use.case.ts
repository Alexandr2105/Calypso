import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ApiConfigService } from '../../../common/helpers/api.config.service';
import { PaginationDto } from '../../api/dto/pagination.dto';

export class GetCountPaymentsCommand {
  constructor(public data: PaginationDto) {}
}

@CommandHandler(GetCountPaymentsCommand)
export class GetCountPaymentsUseCase
  implements ICommandHandler<GetCountPaymentsCommand>
{
  constructor(
    private httpService: HttpService,
    private apiConfigService: ApiConfigService,
  ) {}

  async execute(command: GetCountPaymentsCommand): Promise<any> {
    const url = `${
      this.apiConfigService.paymentsMicroservice +
      '/api/v1/payments/countPayments'
    }`;
    // const url = 'http://localhost:3002/api/v1/payments/countPayments';
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
