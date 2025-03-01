import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { TokenErrors } from './errors/token.errors';

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn = '1h';

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET_KEY as string;
  }

  generateEmailValidationToken(generateTokenDto: GenerateTokenDto): string {
    const { email, id } = generateTokenDto;
    const payload = { email, id };
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '24h',
    });
  }

  generateLoginToken(generateTokenDto: GenerateTokenDto): string {
    const { username, id } = generateTokenDto;

    const payload = { username, id };
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '24h',
    });
  }

  validateToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error: any) {
      if (error instanceof jwt.JsonWebTokenError) {
        return TokenErrors.invalidToken(error.message);
      } else if (error instanceof jwt.TokenExpiredError) {
        return TokenErrors.expiredToken(error.message);
      } else if (error instanceof jwt.NotBeforeError) {
        return TokenErrors.malformedToken(error.message);
      }
    }
  }
}
