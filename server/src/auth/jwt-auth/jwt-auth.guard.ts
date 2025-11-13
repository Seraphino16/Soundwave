import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { TokenService } from '../../token/token.service';
import { AuthErrors } from '../errors/auth.errors';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    let token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      token = request.cookies?.token;
    }

    if (!token && request.cookies) {
      token = request.cookies['token'];
    }

    if (!token) {
      throw new UnauthorizedException(AuthErrors.unauthorized().message);
    }

    const tokenValidation = this.tokenService.validateToken(token);

    if (tokenValidation instanceof Error) {
      throw new UnauthorizedException(tokenValidation.message);
    }

    const user = tokenValidation as JwtPayload;

    request.user = user;

    return true;
  }
}
