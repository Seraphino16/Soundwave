import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { TokenService } from '../token/token.service';
import { AuthErrors } from './errors/auth.errors';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto/auth-dto';

@Injectable()
export class AuthService {}
