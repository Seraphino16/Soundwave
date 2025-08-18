import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { TokenService } from '../token/token.service';
import { AuthErrors } from './errors/auth.errors';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: AuthDto) {
    const { username, email, password } = loginDto;

    if (!username && !email) {
      throw new UnauthorizedException(AuthErrors.missingLogin().message);
    }

    const user = await this.getUserByUsernameOrEmail(username, email);

    if (!user) {
      console.error(
        `Login attempt failed: User not found for username: ${username}, email: ${email}`,
      );
      throw new UnauthorizedException(AuthErrors.invalidCredentials().message);
    }

    if (password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.error(
          `Login attempt failed: Invalid password for user ${user.username}`,
        );
        throw new UnauthorizedException(
          AuthErrors.invalidCredentials().message,
        );
      }
    }

    if (!user.is_verified || !user.is_active) {
      throw new UnauthorizedException(AuthErrors.accountNotActivated().message);
    }

    const token = this.tokenService.generateLoginToken({
      username: user.username,
      id: user.id,
      email: user.email,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const userWithoutPassword = { ...user.toObject(), password: undefined };

    return {
      token,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user: userWithoutPassword,
    };
  }

  private async getUserByUsernameOrEmail(username?: string, email?: string) {
    if (email) {
      return this.userRepository.findByEmail(email);
    }
    return this.userRepository.findByUsername(username as string);
  }
}
