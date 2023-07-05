import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersRepository } from '../infrastructure/users.repository';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userRepo: UsersRepository) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponseForSwagger(HttpStatus.OK, 'All users')
  @Get()
  async getAllUsers() {
    return this.userRepo.getAllUsers();
  }
}
