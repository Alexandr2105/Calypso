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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseForSwagger } from '../../../common/helpers/api-response-for-swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUserProfileCommand } from '../application/use-cases/get.user.profile.use.case';
import { UsersProfilesEntity } from '../entities/users.profiles.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GetUserByIdCommand } from '../application/use-cases/get.user.by.id.use.case';
import { UploadAvatarCommand } from '../application/use-cases/upload.avatar.user.case';
import { DeleteProfileCommand } from '../application/use-cases/delete.profile.use.case';

@ApiTags('Profiles')
@Controller('users/profiles')
export class UsersProfilesController {
  constructor(
    @Inject('FILES_SERVICE_TCP') private clientRMQ: ClientProxy,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UsersProfilesEntity,
  })
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found')
  @Get('profile')
  async getUserProfile(@Req() req) {
    return this.commandBus.execute(new GetUserProfileCommand(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create profile' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'User saved')
  @ApiResponseForSwagger(
    HttpStatus.BAD_REQUEST,
    'List of possible errors:<br>1.Wrong length.<br>2.Invalid date format. Please use the format dd-mm-yyyy.',
  )
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @Post('save-profileInfo')
  async saveUsersProfiles(@Body() body: UsersProfilesDto, @Req() req) {
    await this.commandBus.execute(
      new SaveInfoAboutUsersProfilesCommand(body, req.user.id),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload avatar. "fieldName" must be "avatar"' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Avatar created')
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @Post('save-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async saveAvatar(@UploadedFile() avatar: Express.Multer.File, @Req() req) {
    console.log(2343242342);
    const pattern = { cmd: 'saveAvatar' };
    const user = await this.commandBus.execute(
      new GetUserByIdCommand(req.user.id),
    );
    console.log('Первый');
    const url = await firstValueFrom(
      this.clientRMQ.send(pattern, {
        userId: user.id,
        avatar: avatar.buffer,
      }),
    );
    console.log('agagsdafsdfa');
    return await this.commandBus.execute(
      new UploadAvatarCommand(user.id, user.login, url),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete profile' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Profile deleted')
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @ApiResponseForSwagger(HttpStatus.NOT_FOUND, 'Not Found')
  @Delete('profile')
  async deleteProfile(@Req() req) {
    const userId = req.user.id;
    await this.commandBus.execute(new DeleteProfileCommand(userId));
  }
}
