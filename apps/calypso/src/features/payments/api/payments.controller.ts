import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { All } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';
import { EventPattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { ChangeAccountTypeAndSendMessageCommand } from '../application/use-cases/change.account.type.and.send.message.use.case';
import { SubscriptionsType } from '../../../common/types/subscriptions.type';
import { PaymentsDto } from '../../../../../payments-microservice/src/features/payments/dto/payments.dto';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
import { UrlForSwaggerType } from '../../../common/types/url.for.swagger.type';
import { AllSubscriptionsForSwaggerType } from '../../../common/types/all.subscriptions.for.swagger.type';
import { ApiConfigService } from '../../../common/helpers/api.config.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private httpService: HttpService,
    private commandBus: CommandBus,
    private apiConfigService: ApiConfigService,
  ) {}

  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  @All('*')
  private async forwardPaymentRequest(@Req() req, @Body() body) {
    try {
      // const url = `http://localhost:3002${req.path}`;
      const url = `${this.apiConfigService.paymentsMicroservice + req.path}`;
      console.log(url);
      const response = await firstValueFrom(
        this.httpService.request({
          url,
          method: req.method,
          params: req.query,
          data: { body: body, userId: req.user.id },
        }),
      );
      return response.data;
    } catch (err) {
      throw new BadRequestException(err.response.data);
    }
  }

  @EventPattern({ cmd: 'successPayment' })
  private async changeAccountTypeAndSendMessage(
    data: SubscriptionsType,
  ): Promise<void> {
    await this.commandBus.execute(
      new ChangeAccountTypeAndSendMessageCommand(
        data.userId,
        data.subscriptionType,
        data.endDateOfSubscription,
      ),
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Payment by stipe' })
  @ApiBody({ type: [PaymentsDto] })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UrlForSwaggerType,
  })
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Products not found')
  @Post('stripe')
  fakeMethod1ForSwagger() {
    return;
  }

  @ApiOperation({ summary: 'Payment by paypal' })
  @ApiBearerAuth()
  @ApiBody({ type: [PaymentsDto] })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UrlForSwaggerType,
  })
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Products not found')
  @ApiOperation({ summary: 'Описание вашей операции' })
  @Post('paypal')
  fakeMethod2ForSwagger() {
    return;
  }

  @ApiOperation({ summary: 'All subscriptions' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AllSubscriptionsForSwaggerType,
  })
  @ApiBearerAuth()
  @Get()
  fakeMethod3ForSwagger() {
    return;
  }
}
