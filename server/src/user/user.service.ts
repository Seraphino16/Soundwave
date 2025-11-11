import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
import { CreateUserInfosDto } from './dto/create-user-infos.dto';
import { PasswordUtil } from '../utils/password';
import { ChangePasswordDto } from './dto/change-password-dto';
import { MailerService } from '../mailer/mailer.service';
import { MailerErrors } from '../mailer/errors/mailer.errors';
import { UserSettingsRepository } from './repositories/user-settings.repository';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userInfosRepository: UserInfosRepository,
    private readonly userSettingsRepository: UserSettingsRepository,
    private readonly uploadsService: UploadsService,
    private readonly spotifyService: SpotifyService,
    private readonly passwordUtil: PasswordUtil,
    private readonly mailerService: MailerService,
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

    if (!email || !pseudo || !username || !birthdate) {
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

    const newUser = await this.userRepository.create({
      id,
      email,
      password: hashedPassword,
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
    });

    return newUser.id;
  }

  async createUserInfos(
    userId: number,
    infosDto: CreateUserInfosDto,
    profilePicture?: Express.Multer.File,
    bannerPicture?: Express.Multer.File,
  ): Promise<UserSuccess> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrors.userNotFound().message);
    }

    const existingInfos = await this.userInfosRepository.findByUserId(userId);
    if (existingInfos) {
      throw new ConflictException(UserErrors.userInfosAlreadyExist());
    }

    if (profilePicture) {
      const uploaded = await this.uploadsService.processUserImage(
        userId,
        user.username,
        'profile',
        profilePicture,
      );
      infosDto.profile_picture = uploaded.url;
    }

    if (bannerPicture) {
      const uploaded = await this.uploadsService.processUserImage(
        userId,
        user.username,
        'banner',
        bannerPicture,
      );
      infosDto.banner_picture = uploaded.url;
    }

    const createUserInfosDto = {
      user_id: userId,
      profile_picture: infosDto.profile_picture || '',
      banner_picture: infosDto.banner_picture || '',
      bio: infosDto.bio || '',
      location: infosDto.location || '',
      musicStyle: infosDto.musicStyle || [],
      socialLinks: infosDto.socialLinks || {},
    };

    await this.userInfosRepository.create(createUserInfosDto);

    return UserSuccess.userInfosInsert();
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
      const uploadedProfilePicture = await this.uploadsService.processUserImage(
        userId,
        user.username,
        'profile',
        profilePicture,
      );
      updateUserInfosDto.profile_picture = uploadedProfilePicture.url;
    }

    if (bannerPicture) {
      const uploadedBannerPicture = await this.uploadsService.processUserImage(
        userId,
        user.username,
        'banner',
        bannerPicture,
      );
      updateUserInfosDto.banner_picture = uploadedBannerPicture.url;
    }

    await this.userInfosRepository.update(userId, updateUserInfosDto);

    return UserSuccess.userInfosInsert().message;
  }

  async createUserWithSpotify(spotifyUser: any): Promise<any> {
    const existingUserByEmail = await this.userRepository.findByEmail(
      spotifyUser.email,
    );
    if (existingUserByEmail) {
      throw new ConflictException(UserErrors.emailAlreadyExists().message);
    }

    let displayName = spotifyUser.display_name || '';
    let existingUserByDisplayName =
      await this.userRepository.findByUsername(displayName);
    let count = 1;

    while (existingUserByDisplayName) {
      displayName = `${spotifyUser.display_name || 'user'}${count}`;
      count++;
      existingUserByDisplayName =
        await this.userRepository.findByUsername(displayName);
    }

    const id = await this.userRepository.setId();
    const birthdate = spotifyUser.birthdate
      ? new Date(spotifyUser.birthdate)
      : undefined;

    const newUser = await this.userRepository.create({
      id,
      email: spotifyUser.email,
      password: '',
      pseudo: displayName,
      username: displayName,
      birthdate,
      googleId: undefined,
      twitterId: undefined,
      facebookId: undefined,
      spotifyId: spotifyUser.id,
      deezerId: undefined,
      roles: ['USER'],
      verification_token: undefined,
      is_verified: true,
      is_active: true,
    });

    const createUserInfosDto = {
      user_id: newUser.id,
      profile_picture: spotifyUser.images?.[0]?.url || '',
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

  async loginWithSpotify(spotifyUser: any): Promise<any> {
    const user =
      (spotifyUser.id &&
        (await this.userRepository.findBySpotifyId(spotifyUser.id))) ||
      (spotifyUser.email &&
        (await this.userRepository.findByEmail(spotifyUser.email)));

    if (!user) {
      throw new NotFoundException('Aucun compte associé à ce compte Spotify.');
    }
    return user;
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
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

  async assignBandRole(userId: number): Promise<UserResponse> {
    const user: User = await this.userRepository.assignRole(
      userId,
      UserRole.BAND,
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

  async createUserWithGoogleProfile(profile: any) {
    const existingUser = await this.userRepository.findByEmail(profile.email);

    if (existingUser) {
      throw UserErrors.emailAlreadyExists();
    }

    const id = await this.userRepository.setId();

    const pseudo = profile.name ?? profile.email.split('@')[0];
    const username =
      `${profile.given_name}${profile.family_name}`.toLowerCase();

    const newUser = await this.userRepository.create({
      id: id,
      pseudo,
      username,
      email: profile.email,
      googleId: profile.sub,
      is_verified: true,
      is_active: true,
      roles: ['USER'],
      password: '',
    });

    return newUser;
  }

  async getUserProfile(userId: number): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrors.userNotFound().message);
    }

    const userInfos = await this.userInfosRepository.findByUserId(userId);

    return {
      id: user.id,
      username: user.username,
      pseudo: user.pseudo,
      birthdate: user.birthdate,
      email: user.email,
      roles: user.roles,
      is_verified: user.is_verified,
      is_active: user.is_active,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      ...(userInfos && {
        profile_picture: userInfos.profile_picture,
        banner_picture: userInfos.banner_picture,
        bio: userInfos.bio,
        location: userInfos.location,
        musicStyle: userInfos.musicStyle,
        socialLinks: userInfos.socialLinks,
      }),
    };
  }

  async updateUserProfile(userId: number, updateData: any): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrors.userNotFound().message);
    }

    if (updateData.pseudo || updateData.username) {
      if (updateData.pseudo) {
        user.pseudo = updateData.pseudo;
      }

      if (updateData.username) {
        const existingUser = await this.userRepository.findByUsername(
          updateData.username,
        );
        if (existingUser && existingUser.id !== userId) {
          throw new BadRequestException(
            "Ce nom d'utilisateur est déjà utilisé",
          );
        }
        user.username = updateData.username;
      }

      user.updatedAt = new Date();
      await this.userRepository.save(user);
    }

    if (
      updateData.bio !== undefined ||
      updateData.location !== undefined ||
      updateData.musicStyle !== undefined ||
      updateData.profile_picture !== undefined ||
      updateData.banner_picture !== undefined
    ) {
      const userInfosUpdateData: any = {};

      if (updateData.bio !== undefined) {
        userInfosUpdateData.bio = updateData.bio;
      }

      if (updateData.location !== undefined) {
        userInfosUpdateData.location = updateData.location;
      }

      if (updateData.musicStyle !== undefined) {
        userInfosUpdateData.musicStyle = updateData.musicStyle;
      }

      if (updateData.profile_picture !== undefined) {
        userInfosUpdateData.profile_picture = updateData.profile_picture;
      }

      if (updateData.banner_picture !== undefined) {
        userInfosUpdateData.banner_picture = updateData.banner_picture;
      }

      userInfosUpdateData.updatedAt = new Date();

      const existingUserInfos =
        await this.userInfosRepository.findByUserId(userId);
      if (existingUserInfos) {
        await this.userInfosRepository.update(userId, userInfosUpdateData);
      } else {
        const id = await this.userInfosRepository.setId();
        const createUserInfosData = {
          id,
          user_id: userId,
          profile_picture: updateData.profile_picture || '',
          banner_picture: updateData.banner_picture || '',
          bio: updateData.bio || '',
          location: updateData.location || '',
          musicStyle: updateData.musicStyle || [],
          socialLinks: {},
          ...userInfosUpdateData,
        };
        await this.userInfosRepository.create(createUserInfosData);
      }
    }

    return await this.getUserProfile(userId);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(UserErrors.passwordsDoNotMatch().message);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(UserErrors.userNotFound());
    }

    if (!user.password || user.password.trim() === '') {
      user.password = await this.passwordUtil.hashPassword(dto.newPassword);
      await this.userRepository.save(user);

      return UserSuccess.passwordCreate();
    }

    if (!dto.oldPassword) {
      throw new BadRequestException(UserErrors.oldPasswordRequired().message);
    }

    const isValid = await this.passwordUtil.comparePasswords(
      dto.oldPassword,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException(
        UserErrors.oldPasswordDoNotMatch().message,
      );
    }

    user.password = await this.passwordUtil.hashPassword(dto.newPassword);
    await this.userRepository.save(user);

    return UserSuccess.passwordUpdate();
  }

  async deleteAccount(
    userId: number,
    userEmail: string,
    username: string,
  ): Promise<UserErrors | UserSuccess> {
    try {
      const deletedUser = await this.userRepository.deleteById(userId);

      if (!deletedUser) {
        return UserErrors.userNotFound();
      }

      const emailResult = await this.mailerService.sendSuppressionEmail({
        to: userEmail,
        username,
      });

      if (emailResult instanceof MailerErrors) {
        return MailerErrors.emailNotSent();
      }

      return UserSuccess.accountDeleted();
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors la suppression du compte",
        error,
      );
      return UserErrors.internalServerError();
    }
  }

  async getUserSettings(user_id: number) {
    const settings =
      await this.userSettingsRepository.getSettingsByUserId(user_id);
    if (!settings) {
      throw new NotFoundException(UserErrors.settingsNotFound(user_id).message);
    }
    return settings;
  }

  async createUserSettings(user_id: number) {
    return this.userSettingsRepository.createSettings(user_id);
  }

  async updateUserSettings(user_id: number, dto: UpdateUserSettingsDto) {
    const updated = await this.userSettingsRepository.updateSettingsByUserId(
      user_id,
      dto,
    );
    if (!updated) {
      throw new InternalServerErrorException(
        UserErrors.settingsDoNotUpdate(user_id).message,
      );
    }
    return updated;
  }

  async searchUsers(query: string, limit: number = 10) {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException(
        'La recherche doit contenir au moins 2 caractères',
      );
    }

    const users = await this.userRepository.searchUsers(query.trim(), limit);
    return this.enrichUsersWithProfile(users);
  }

  async getPopularUsers(limit: number = 10) {
    const users = await this.userRepository.findPopularUsers(limit);
    return this.enrichUsersWithProfile(users);
  }

  private async enrichUsersWithProfile(users: User[]): Promise<any[]> {
    const userIds = users.map((user) => user.id);
    const userInfos = await this.userInfosRepository.findByUserIds(userIds);

    const userInfosMap = new Map(userInfos.map((info) => [info.user_id, info]));
    return users.map((user) => {
      const infos = userInfosMap.get(user.id);
      return {
        id: user.id,
        username: user.username,
        pseudo: user.pseudo,
        profile_picture: infos?.profile_picture || null,
        is_verified: user.is_verified,
      };
    });
  }
}
