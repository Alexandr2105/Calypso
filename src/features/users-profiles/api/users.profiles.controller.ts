import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { UploadAvatarCommand } from '../application/use-cases/upload.avatar.user.case';
import { GetUserProfileCommand } from '../application/use-cases/get.user.profile.use.case';

@ApiTags('Profiles')
@Controller('users/profiles')
export class UsersProfilesController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: HttpStatus.OK, type: UsersProfilesDto })
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @Get('profile')
  async getUserProfile(@Req() req) {
    return this.commandBus.execute(new GetUserProfileCommand(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create profile' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'User saved')
  @ApiResponseForSwagger(HttpStatus.BAD_REQUEST, 'Validation error')
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
  @ApiOperation({ summary: 'Upload avatar' })
  @ApiResponseForSwagger(HttpStatus.NO_CONTENT, 'Avatar create')
  @ApiResponseForSwagger(HttpStatus.UNAUTHORIZED, 'Unauthorized')
  @Post('save-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async saveAvatar(@UploadedFile() avatar: Express.Multer.File, @Req() req) {
    return await this.commandBus.execute(
      new UploadAvatarCommand(req.user.id, avatar.buffer),
    );
  }
}
