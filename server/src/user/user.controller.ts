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
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserInfosDto } from './dto/update-user-infos.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserErrors } from './errors/user.errors';
import { UserSuccess } from './success/user.success';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SpotifyService } from '../spotify/spotify.service';
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

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly spotifyService: SpotifyService,
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
  @ApiBody({ type: [CreateUserDto] })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserSuccess> {
    try {
      const userId = await this.userService.createUser(createUserDto);

      const generateTokenDto = {
        email: createUserDto.email,
        username: createUserDto.username,
        id: userId,
      };
      const tokenResponse = await firstValueFrom(
        this.httpService.post(
          'http://localhost:5001/token/generate-email-validation',
          generateTokenDto,
        ),
      );

      const token = tokenResponse.data;
      await this.userService.saveValidationToken(userId, token);

      await firstValueFrom(
        this.httpService.post(
          'http://localhost:5001/mailer/send-validation-email',
          {
            email: createUserDto.email,
            token: token,
          },
        ),
      );

      return UserSuccess.userCreated(userId);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new BadRequestException(UserErrors.unknownError().message);
    }
  }

  @ApiOperation({ summary: 'Mettre à jour les informations utilisateurs' })
  @ApiBody({ type: [UpdateUserInfosDto] })
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
    const isLoginBool = isLogin === 'true';
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
      const newUser = await this.userService.createUserWithSpotify(spotifyUser);

      return res.status(201).json({
        message: 'Inscription réussie via Spotify',
        user: newUser,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Erreur lors de l'inscription via Spotify",
        error: error.message,
      });
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
}
