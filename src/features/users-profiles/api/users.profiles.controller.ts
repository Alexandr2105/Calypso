import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UsersProfilesDto } from '../dto/users.profiles.dto';
import { SaveInfoAboutUsersProfilesCommand } from '../application/use-cases/save.info.about.users.profiles.use.case';
import { JwtAuthGuard } from '../../../common/guards/jwt.auth.guard';

@Controller('users/profiles')
export class UsersProfilesController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async saveUsersProfiles(@Body() body: UsersProfilesDto, @Req() req) {
    await this.commandBus.execute(
      new SaveInfoAboutUsersProfilesCommand(body, req.user.id),
    );
  }
}
