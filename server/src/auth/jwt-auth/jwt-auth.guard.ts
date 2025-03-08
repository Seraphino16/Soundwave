import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { TokenService } from '../../token/token.service';
import { AuthErrors } from '../errors/auth.errors';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException(AuthErrors.unauthorized().message);
    }

    const tokenValidation = this.tokenService.validateToken(token);

    if (tokenValidation instanceof Error) {
      throw new UnauthorizedException(tokenValidation.message);
    }

    request.user = tokenValidation;
    return true;
  }
}
