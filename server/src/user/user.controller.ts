import {
  Controller,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Post,
  Patch,
  Query,
  BadRequestException,
  ConflictException,
  Get,
  InternalServerErrorException,
  Res,
  NotFoundException,
  UseGuards,
  Delete,
  Req,
} from '@nestjs/common';
import { UserErrors } from './errors/user.errors';
import { UserSuccess } from './success/user.success';
import { MailerErrors } from '../mailer/errors/mailer.errors';
import { TokenErrors } from '../token/errors/token.errors';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { SpotifyService } from '../spotify/spotify.service';
import { UpdateUserInfosDto } from './dto/update-user-infos.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleService } from '../google/google.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TokenService } from '../token/token.service';
import { MailerService } from '../mailer/mailer.service';
import { CreateUserInfosDto } from './dto/create-user-infos.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password-dto';
import { CurrentUser } from '../auth/decorator/current-user-decorator';
import { JwtPayload } from 'jsonwebtoken';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
    private readonly spotifyService: SpotifyService,
    private readonly googleService: GoogleService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiCreatedResponse({
    description: 'Utilisateur créé avec succès',
    type: UserSuccess,
  })
  @ApiBadRequestResponse({
    description: `Erreurs de validation :
    - L'email est requis
    - Format de l’email invalide
    - Mot de passe trop court
    - Mot de passe sans majuscule / minuscule / chiffre / caractère spécial
    - Pseudo ou nom d'utilisateur manquant
    - Les mots de passe ne correspondent pas
    - Date de naissance invalide ou âge < 13 ans`,
    type: UserErrors,
  })
  @ApiConflictResponse({
    description: `Conflit de données :
    - L'email existe déjà
    - Le nom d'utilisateur existe déjà`,
    type: UserErrors,
  })
  @ApiNotFoundResponse({
    description: 'Utilisateur non trouvé',
    type: UserErrors,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erreur inconnue',
    type: UserErrors,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erreur inconnue du serveur',
    type: UserErrors,
  })
  @ApiBody({ type: CreateUserDto })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserSuccess | UserErrors> {
    try {
      const userId = await this.userService.createUser(createUserDto);
      await this.userService.createUserSettings(userId);

      const activationToken = this.tokenService.generateEmailValidationToken({
        email: createUserDto.email,
        username: createUserDto.username,
        id: userId,
        roles: createUserDto.roles,
      });

      await this.userService.saveValidationToken(userId, activationToken);

      await this.mailerService.sendValidationEmail({
        to: createUserDto.email,
        username: createUserDto.username,
        token: activationToken,
      });

      return UserSuccess.userCreated(userId);
    } catch (error) {
      if (
        error instanceof UserErrors ||
        error instanceof MailerErrors ||
        error instanceof TokenErrors
      ) {
        throw error;
      }

      throw UserErrors.unknownError();
    }
  }

  @Post(':userId/infos')
  @UseInterceptors(
    FileInterceptor('profilePicture'),
    FileInterceptor('bannerPicture'),
  )
  async createUserInfos(
    @Param('userId') userId: number,
    @Body() createUserInfosDto: CreateUserInfosDto,
    @UploadedFile('profilePicture') profilePicture?: Express.Multer.File,
    @UploadedFile('bannerPicture') bannerPicture?: Express.Multer.File,
  ) {
    try {
      const userInfos = await this.userService.createUserInfos(
        userId,
        createUserInfosDto,
        profilePicture,
        bannerPicture,
      );
      return userInfos;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Erreur lors de l'enregistrement des informations utilisateur",
      );
    }
  }

  @ApiOperation({ summary: 'Mettre à jour les informations utilisateurs' })
  @ApiBody({ type: UpdateUserInfosDto })
  @ApiOkResponse({
    description: 'Informations utilisateur enregistrée avec succès',
    type: UserSuccess,
  })
  @ApiBadRequestResponse({
    description: `Erreurs possibles :
    - Champs requis manquants
    - Email invalide`,
    type: UserErrors,
  })
  @ApiConflictResponse({
    description: `Erreurs de conflit :
    - L'email existe déjà
    - Le nom d'utilisateur existe déjà`,
    type: UserErrors,
  })
  @ApiNotFoundResponse({
    description: 'Utilisateur non trouvé',
    type: UserErrors,
  })
  @ApiInternalServerErrorResponse({
    description: 'Erreur inconnue du serveur',
    type: UserErrors,
  })
  @UseGuards(JwtAuthGuard)
  @Put(':userId/infos')
  @UseInterceptors(
    FileInterceptor('profilePicture'),
    FileInterceptor('bannerPicture'),
  )
  async updateUserInfos(
    @Param('userId') userId: number,
    @Body() updateUserInfosDto: UpdateUserInfosDto,
    @UploadedFile('profilePicture') profilePicture?: Express.Multer.File,
    @UploadedFile('bannerPicture') bannerPicture?: Express.Multer.File,
  ) {
    try {
      const updatedUserInfos = await this.userService.updateInfos(
        userId,
        updateUserInfosDto,
        profilePicture,
        bannerPicture,
      );
      return updatedUserInfos;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour des informations.',
      );
    }
  }
  @Get('create/spotify')
  redirectToSpotifyAuth(@Query('isLogin') isLogin: string = 'false') {
    const authUrl = this.spotifyService.generateSpotifyAuthUrl();
    return { url: authUrl };
  }

  @Get('create/spotify/callback')
  async spotifyCallback(
    @Query('code') code: string,
    @Query('isLogin') isLogin: string = 'false',
    @Res() res,
  ) {
    try {
      const isLoginBool = isLogin === 'true';
      const accessToken =
        await this.spotifyService.getAccessTokenFromCode(code);
      const spotifyUser =
        await this.spotifyService.getSpotifyUserData(accessToken);

      try {
        const newUser =
          await this.userService.createUserWithSpotify(spotifyUser);

        return res.redirect('http://localhost:3000/home');
      } catch (error) {
        if (
          error instanceof ConflictException ||
          error?.message?.includes('email existe déjà') ||
          error?.message?.includes("L'email existe déjà")
        ) {
          return res.redirect(
            'http://localhost:3000/error-email-already-exists',
          );
        }
        return res.redirect('http://localhost:3000/error');
      }
    } catch (error) {
      return res.redirect('http://localhost:3000/error');
    }
  }

  @Get('validate')
  async validateAccount(@Query('token') token: string): Promise<UserSuccess> {
    try {
      await this.userService.validateAndActivateAccount(token);
      return UserSuccess.accountValidated();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erreur interne lors de la validation du compte',
      );
    }
  }

  @Get('me')
  async getMe(@Req() req) {
    try {
      const token = req.cookies?.token;

      if (!token) {
        throw new BadRequestException("Token d'authentification manquant");
      }


      let decoded: any;
      try {
        decoded = this.tokenService.verifyToken(token);
      } catch (tokenError) {
        console.error('Erreur de vérification du token:', tokenError);
        throw new BadRequestException('Token invalide');
      }

      if (!decoded || typeof decoded !== 'object' || !decoded.id) {
        throw new BadRequestException('Token invalide');
      }

      const user = await this.userService.findUserById(decoded.id);

      if (!user) {
        throw new BadRequestException('Utilisateur non trouvé');
      }

      return user;
    } catch (error) {
      console.error('Erreur complète dans getMe:', error);
      throw new BadRequestException('Accès non autorisé');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('request-artist')
  async requestArtist(
    @Body('automatic') automatic: string,
    @Body('id') id: number,
  ) {
    try {
      if (!automatic) {
        const updatedUser = await this.userService.assignArtistRole(id);
        return UserSuccess.userRoleUpdated(updatedUser);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(UserErrors.unknownError().message);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Patch('request-band')
  async requestBand(@Body('id') id: number): Promise<UserSuccess> {
    try {
      const updatedUser = await this.userService.assignBandRole(id);
      return UserSuccess.userRoleUpdated(updatedUser);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(UserErrors.unknownError().message);
    }
  }

  @Get('create/google')
  redirectToGoogleAuth() {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new InternalServerErrorException('Google client ID non défini');
    }

    const params = new URLSearchParams();
    params.set('client_id', process.env.GOOGLE_CLIENT_ID);
    params.set(
      'redirect_uri',
      `${process.env.REACT_APP_API_BASE_URL}/users/create/google/callback`,
    );
    params.set('response_type', 'code');
    params.set('scope', 'openid email profile');
    params.set('access_type', 'offline');
    params.set('prompt', 'consent');

    return { url: `${baseUrl}?${params.toString()}` };
  }

  @Get('create/google/callback')
  async googleCallback(@Query('code') code: string, @Res() res) {
    try {
      const user = await this.googleService.registerWithGoogle(code);
      return res.status(201).json(UserSuccess.userCreated(user.id));
    } catch (error) {
      if (error instanceof UserErrors) {
        return res.status(400).json(error);
      }

      return res.status(500).json(UserErrors.unknownError());
    }
  }

  @Get(':userId/profile')
  @ApiOperation({ summary: 'Récupérer le profil utilisateur complet' })
  @ApiOkResponse({ description: 'Profil utilisateur retourné avec succès' })
  @ApiNotFoundResponse({ description: 'Utilisateur non trouvé' })
  async getUserProfile(@Param('userId') userId: number) {
    try {
      return await this.userService.getUserProfile(userId);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du profil',
      );
    }
  }

  @Put(':userId/profile')
  @ApiOperation({ summary: 'Mettre à jour le profil utilisateur' })
  @ApiOkResponse({ description: 'Profil utilisateur mis à jour avec succès' })
  @ApiNotFoundResponse({ description: 'Utilisateur non trouvé' })
  async updateUserProfile(
    @Param('userId') userId: number,
    @Body() updateData: any,
    @Req() req: any,
  ) {
    try {
      const token = req.cookies?.token;
      if (!token) {
        throw new BadRequestException("Token d'authentification manquant");
      }

      let decoded: any;
      try {
        decoded = this.tokenService.verifyToken(token);
      } catch (tokenError) {
        throw new BadRequestException('Token invalide');
      }

      if (!decoded || typeof decoded !== 'object' || !decoded.id) {
        throw new BadRequestException('Token invalide');
      }

      if (decoded.id !== Number(userId)) {
        throw new BadRequestException('Vous ne pouvez pas modifier ce profil');
      }

      return await this.userService.updateUserProfile(userId, updateData);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour du profil',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/password')
  async changePassword(
    @Param('id') id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    if (user.id !== Number(id)) {
      return UserErrors.permissionDeletedAccountDenied();
    }

    return this.userService.deleteAccount(user.id, user.email, user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/settings/:user_id')
  async getSettings(@Param('user_id') user_id: number) {
    return this.userService.getUserSettings(user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/settings/:user_id')
  async updateSettings(
    @Param('user_id') user_id: number,
    @Body() dto: UpdateUserSettingsDto,
  ) {
    return this.userService.updateUserSettings(user_id, dto);
  }

  @Get('/search')
  @ApiOperation({ summary: 'Rechercher des utilisateurs' })
  @ApiOkResponse({ description: 'Liste des utilisateurs trouvés' })
  async searchUsers(@Query('q') query: string, @Query('limit') limit?: number) {
    return await this.userService.searchUsers(query, limit || 10);
  }

  @Get('/popular')
  @ApiOperation({ summary: 'Obtenir les utilisateurs populaires' })
  @ApiOkResponse({ description: 'Liste des utilisateurs populaires' })
  async getPopularUsers(@Query('limit') limit?: number) {
    return await this.userService.getPopularUsers(limit || 10);
  }
}
