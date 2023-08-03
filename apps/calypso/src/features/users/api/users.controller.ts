import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../application/use-case/delete.user.use.case';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private commandBus: CommandBus) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  // @UseGuards(BasicAuthGuard)
  @ApiOperation({ summary: 'Delete user for test' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'User deleted')
  @ApiBasicAuth()
  @Delete(':userId')
  async getAllUsers(@Param('userId') userId: string) {
    await this.commandBus.execute(new DeleteUserCommand(userId));
  }
}
