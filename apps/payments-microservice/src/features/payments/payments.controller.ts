import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('api/v1/payments')
export class PaymentsController {
  @Get('get')
  async getInfo(@Body() body, @Req() req) {
    return 'Ok';
  }

  @Post('get')
  async postInfo(@Body() body, @Req() req) {
    return 'Ok1';
  }
}
