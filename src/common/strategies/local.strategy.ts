import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../features/users/infrastructure/users.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepo: UsersRepository) {
    super({
      usernameField: 'loginOrEmail',
    });
  }
  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.userRepo.getUserByLoginOrEmail(loginOrEmail);
    if (!user) return false;
    // const user = await this.userRepo.getUserByLoginOrEmail(loginOrEmail);
    // if (!user) throw new UnauthorizedException();
    // return user;
  }
}
