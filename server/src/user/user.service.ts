import {
  BadRequestException,
  ConflictException,
  Injectable, InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserErrors } from './errors/user.errors';
import * as bcrypt from 'bcryptjs';
import { UpdateUserInfosDto } from './dto/update-user-infos.dto';
import { UploadsService } from '../uploads/uploads.service';
import { UserInfosRepository } from './repositories/user-infos.repository';
import { UserSuccess } from './success/user.success';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userInfosRepository: UserInfosRepository,
    private readonly uploadsService: UploadsService,
  ) {}

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

    const createUserInfosDto = {
      user_id: newUser.id,
      profile_picture: '',
      banner_picture: '',
      bio: '',
      location: '',
      musicStyle: [],
      socialLinks: {},
    };

    await this.userInfosRepository.create(createUserInfosDto);

    return newUser.id;
  }

  async updateInfos(
    userId: number,
    updateUserInfosDto: UpdateUserInfosDto,
    profilePicture?: Express.Multer.File,
    bannerPicture?: Express.Multer.File,
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrors.userNotFound().message);
    }

    if (profilePicture) {
      const uploadedProfilePicture =
        this.uploadsService.handleFileUpload(profilePicture);
      if (uploadedProfilePicture) {
        updateUserInfosDto.profile_picture = uploadedProfilePicture.filePath;
      } else {
        throw new InternalServerErrorException(
          'Erreur lors du téléchargement de la photo de profile',
        );
      }
    }

    if (bannerPicture) {
      const uploadedBannerPicture =
        this.uploadsService.handleFileUpload(bannerPicture);
      if (uploadedBannerPicture) {
        updateUserInfosDto.banner_picture = uploadedBannerPicture.filePath;
      } else {
        throw new InternalServerErrorException('Banner picture upload failed');
      }
    }

    await this.userInfosRepository.update(userId, updateUserInfosDto);

    return UserSuccess.userInfosInsert().message;
  }

  private validateAge(birthdate: Date): void {
    const birthDate = new Date(birthdate);
    if (isNaN(birthDate.getTime())) {
      throw new BadRequestException(UserErrors.birthdateInvalid().message);
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    const day = today.getDate() - birthDate.getDate();

    if (month < 0 || (month === 0 && day < 0)) {
      age--;
    }

    if (age < 13) {
      throw new BadRequestException(UserErrors.ageTooYoung().message);
    }
  }

  async saveValidationToken(userId: number, token: string): Promise<void> {
    const success = await this.userRepository.setValidationToken(userId, token);
    if (!success) {
      throw new BadRequestException(UserErrors.userNotFound().message);
    }
  }

  async validateAndActivateAccount(token: string): Promise<void> {
    const user = await this.userRepository.findByVerificationToken(token);

    if (!user) {
      throw new BadRequestException(UserErrors.invalidToken().message);
    }

    const success = await this.userRepository.activateUser(user.id);

    if (!success) {
      throw new BadRequestException(UserErrors.activationFailed().message);
    }
  }
}
