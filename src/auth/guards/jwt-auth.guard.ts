import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info: Error) {
    console.log(JwtAuthGuard);
    console.log({ user });
    console.log({ err });
    console.log({ info });
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
