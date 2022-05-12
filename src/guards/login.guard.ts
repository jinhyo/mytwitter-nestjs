import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { LOGIN_IS_NEEDED_MSG } from 'src/commonConstants/errorMsgs/guardErrorMsgs';

@Injectable()
export class LoginGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(LOGIN_IS_NEEDED_MSG);
    }
    return user;
  }
}
