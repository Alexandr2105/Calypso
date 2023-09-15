import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllDevicesCurrentUserCommand } from '../application/use-cases/get.all.devices.current.user.use.case';
import {
  SwaggerDecoratorByDeleteAllDevicesExceptTheCurrentDevice,
  SwaggerDecoratorByDeleteDevice,
  SwaggerDecoratorByGetAllDevicesCurrentUser,
  SwaggerDecoratorByGetCurrentDevice,
} from '../swagger/swagger.devices.decorators';
import { RefreshTokenType } from '../../../common/types/refresh.token.type';
import { DeviceDto } from '../dto/device.dto';
import { DeleteDeviceByIdCommand } from '../application/delete.device.by.id.use.case';
import { DeleteAllDevicesExceptTheCurrentDeviceCommand } from '../application/use-cases/delete.all.devices.except.the.current.device.use.case';
import { Jwt } from '../../../common/jwt/jwt';
import { GetCurrentDeviceCommand } from '../application/use-cases/get.current.device.use.case';

@ApiTags('Devices')
@Controller('devices')
export class DevicesController {
  constructor(private commandBus: CommandBus, private jwtService: Jwt) {}

  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByGetAllDevicesCurrentUser()
  @Get()
  async getAllDevicesCurrentUser(@Req() req): Promise<RefreshTokenType[]> {
    return await this.commandBus.execute(
      new GetAllDevicesCurrentUserCommand(req.user.id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByDeleteDevice()
  @Delete('device')
  async deleteDevice(@Body() body: DeviceDto, @Req() req) {
    await this.commandBus.execute(
      new DeleteDeviceByIdCommand(body.deviceId, req.user.id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByDeleteAllDevicesExceptTheCurrentDevice()
  @Delete()
  async deleteAllDevicesExceptTheCurrentDevice(@Req() req) {
    const refreshToken = req.cookies.refreshToken;
    const infoAboutUser: any =
      this.jwtService.getUserByRefreshToken(refreshToken);
    await this.commandBus.execute(
      new DeleteAllDevicesExceptTheCurrentDeviceCommand(
        infoAboutUser.deviceId,
        req.user.id,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByGetCurrentDevice()
  @Get('current')
  async getCurrentDevice(@Req() req): Promise<RefreshTokenType> {
    const refreshToken = req.cookies.refreshToken;
    const infoAboutUser: any =
      this.jwtService.getUserByRefreshToken(refreshToken);
    return this.commandBus.execute(
      new GetCurrentDeviceCommand(infoAboutUser.deviceId),
    );
  }
}
