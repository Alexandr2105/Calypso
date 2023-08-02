import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
import { BasicAuthGuard } from '../../../common/guards/basic.auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard)
  @ApiOperation({ summary: 'Delete user for test' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'User deleted')
  @ApiBasicAuth()
  @Delete(':userId')
  async getAllUsers() {
    // return this.userRepo.getAllUsers();
  }
}
