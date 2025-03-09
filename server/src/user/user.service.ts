import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
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
import { UserRole } from '../config/user.config';
import { User, UserResponse } from './entities/user.entity';
import axios from 'axios';
import { SpotifyService } from '../spotify/spotify.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userInfosRepository: UserInfosRepository,
    private readonly uploadsService: UploadsService,
    private readonly spotifyService: SpotifyService,
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

    if (!email || !pseudo || !username) {
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
  async createUserWithSpotify(spotifyUser: any): Promise<any> {
    const existingUserByEmail = await this.userRepository.findByEmail(spotifyUser.email);
    if (existingUserByEmail) {
      throw new ConflictException(UserErrors.emailAlreadyExists().message);
    }

    let displayName = spotifyUser.display_name || '';
    let existingUserByDisplayName = await this.userRepository.findByUsername(displayName);
    let count = 1;

    while (existingUserByDisplayName) {
      displayName = `${spotifyUser.display_name || 'user'}${count}`;
      count++;
      existingUserByDisplayName = await this.userRepository.findByUsername(displayName);
    }

    const id = await this.userRepository.setId();
    const birthdate = spotifyUser.birthdate ? new Date(spotifyUser.birthdate) : null;

    const newUser = await this.userRepository.create(
      id,
      spotifyUser.email,
      '',
      displayName,
      displayName,
      birthdate,
      undefined,
      undefined,
      undefined,
      undefined,
      spotifyUser.id,
      ['USER'],
      undefined,
      true,
      true,
    );

    const createUserInfosDto = {
      user_id: newUser.id,
      profile_picture: spotifyUser.images[0]?.url || '',
      banner_picture: '',
      bio: '',
      location: '',
      musicStyle: [],
      socialLinks: {
        spotify: `https://open.spotify.com/user/${spotifyUser.id}`,
      },
    };

    await this.userInfosRepository.create(createUserInfosDto);

    return newUser;
  }

  async getSpotifyUserData(accessToken: string): Promise<any> {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
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

  async assignArtistRole(userId: number): Promise<UserResponse> {
    const user: User = await this.userRepository.assignRole(
      userId,
      UserRole.ARTIST,
    );
    return this.mapUserForResponse(user);
  }

  private mapUserForResponse(user: User): UserResponse {
    return {
      id: user.id,
      pseudo: user.pseudo,
      username: user.username,
      birthdate: user.birthdate,
      roles: user.roles,
      is_verified: user.is_verified,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as UserResponse;
  }
}
