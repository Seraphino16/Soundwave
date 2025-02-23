import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserErrors } from './errors/user.errors';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<number> {
    const {
      email,
      pseudo,
      username,
      birthdate,
      password,
      passwordConfirm,
      googleId,
      twitterId,
      facebookId,
      spotifyId,
      deezerId,
      roles,
      verification_token,
      is_verified = false,
      is_active = false,
    } = createUserDto;

    if (!email || !pseudo || !username || !birthdate || !roles) {
      throw new BadRequestException(UserErrors.missingRequiredFields().message);
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException(UserErrors.passwordsDoNotMatch().message);
    }

    this.validateAge(birthdate);

    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException(UserErrors.emailAlreadyExists().message);
    }

    const existingUserByUsername =
      await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException(UserErrors.usernameAlreadyExists().message);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await this.userRepository.setId();

    const newUser = await this.userRepository.create(
      id,
      email,
      hashedPassword,
      pseudo,
      username,
      birthdate,
      googleId,
      twitterId,
      facebookId,
      spotifyId,
      deezerId,
      roles,
      verification_token,
      is_verified,
      is_active,
    );

    return newUser.id;
  }
}
