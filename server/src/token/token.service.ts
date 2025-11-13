import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { TokenErrors } from './errors/token.errors';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Token invalide');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Token expiré');
      } else if (error.name === 'NotBeforeError') {
        throw new Error('Token pas encore valide');
      }
      throw new Error('Erreur de vérification du token');
    }
  }

  generateEmailValidationToken(generateTokenDto: GenerateTokenDto): string {
    const { email, id } = generateTokenDto;
    const payload = { email, id };
    return this.jwtService.sign(payload, { expiresIn: '24h' });
  }

  generateLoginToken(generateTokenDto: GenerateTokenDto): string {
    const { username, id, email, roles } = generateTokenDto;
    const payload = { username, id, email, roles };
    return this.jwtService.sign(payload, { expiresIn: '24h' });
  }

  validateToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        return TokenErrors.invalidToken(error.message);
      } else if (error.name === 'TokenExpiredError') {
        return TokenErrors.expiredToken(error.message);
      } else if (error.name === 'NotBeforeError') {
        return TokenErrors.malformedToken(error.message);
      }
      return error.message;
    }
  }
}
