import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UsersProfilesDto } from '../dto/users.profiles.dto';
import { SaveInfoAboutUsersProfilesCommand } from '../application/use-cases/save.info.about.users.profiles.use.case';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserProfileCommand } from '../application/use-cases/get.user.profile.use.case';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetUserByIdCommand } from '../application/use-cases/get.user.by.id.use.case';
import { UploadAvatarCommand } from '../application/use-cases/upload.avatar.user.case';
import { DeleteProfileCommand } from '../application/use-cases/delete.profile.use.case';
import {
  SwaggerDecoratorByDeleteProfile,
  SwaggerDecoratorByGetProfile,
  SwaggerDecoratorByPostSaveAvatar,
  SwaggerDecoratorByPostSaveProfileInfo,
} from '../swagger/swagger.users.profile.decorator';

@ApiTags('Profiles')
@Controller('users/profiles')
export class UsersProfilesController {
  constructor(
    @Inject('FILES_SERVICE_TCP') private clientTCP: ClientProxy,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByGetProfile()
  @Get('profile')
  async getUserProfile(@Req() req) {
    return this.commandBus.execute(new GetUserProfileCommand(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerDecoratorByPostSaveProfileInfo()
  @Post('save-profileInfo')
  async saveUsersProfiles(@Body() body: UsersProfilesDto, @Req() req) {
    await this.commandBus.execute(
      new SaveInfoAboutUsersProfilesCommand(body, req.user.id),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByPostSaveAvatar()
  @Post('save-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async saveAvatar(@UploadedFile() avatar: Express.Multer.File, @Req() req) {
    const pattern = { cmd: 'saveAvatar' };
    const user = await this.commandBus.execute(
      new GetUserByIdCommand(req.user.id),
    );
    const url = await firstValueFrom(
      this.clientTCP.send(pattern, {
        userId: user.id,
        avatar: avatar.buffer,
      }),
    );
    return await this.commandBus.execute(
      new UploadAvatarCommand(user.id, user.login, url),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @SwaggerDecoratorByDeleteProfile()
  @Delete('profile')
  async deleteProfile(@Req() req) {
    const userId = req.user.id;
    await this.commandBus.execute(new DeleteProfileCommand(userId));
  }
}
