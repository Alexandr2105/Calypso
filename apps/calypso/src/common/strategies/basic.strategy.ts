import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { adminPassword } from '../authUsers/usersPasswords';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor() {
    super();
  }
  public validate = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    if (
      username === adminPassword.username &&
      password === adminPassword.password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
