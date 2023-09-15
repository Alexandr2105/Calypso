import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../application/use-case/delete.user.use.case';
import { BasicAuthGuard } from '../../../common/guards/basic.auth.guard';
import { SwaggerDecoratorByDeleteUserId } from '../swagger/swagger.users.decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private commandBus: CommandBus) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard)
  @SwaggerDecoratorByDeleteUserId()
  @Delete(':userId')
  async getAllUsers(@Param('userId') userId: string) {
    await this.commandBus.execute(new DeleteUserCommand(userId));
  }
}
