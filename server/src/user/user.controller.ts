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
  UseGuards,
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
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
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
  @ApiBody({ type: CreateUserDto })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserSuccess | UserErrors> {
    try {
      const userId = await this.userService.createUser(createUserDto);

      const activationToken = this.tokenService.generateEmailValidationToken({
        email: createUserDto.email,
        username: createUserDto.username,
        id: userId,
      });

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
        const newUser = await this.userService.createUserWithSpotify(spotifyUser);

        return res.redirect('http://localhost:3000/welcome');
      } catch (error) {
        if (
          error instanceof ConflictException ||
          error?.message?.includes("email existe déjà") ||
          error?.message?.includes("L'email existe déjà")
        ) {
          return res.redirect('http://localhost:3000/error-email-already-exists');
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
@UseGuards(JwtAuthGuard)
getMe(@Req() req) {
  return req.user;
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
