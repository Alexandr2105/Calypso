import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { adminPassword } from '../../common/authUsers/usersPasswords';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const login = ctx.getContext().req.headers.login;
    const pass = ctx.getContext().req.headers.password;
    if (login === adminPassword.username && pass === adminPassword.password) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
