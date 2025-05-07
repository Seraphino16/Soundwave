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
  Get,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { UserErrors } from './errors/user.errors';
import { UserSuccess } from './success/user.success';
import { MailerErrors } from '../mailer/errors/mailer.errors';
import { TokenErrors } from '../token/errors/token.errors';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { MailerService } from '../mailer/mailer.service';
import { TokenService } from '../token/token.service';
import { SpotifyService } from '../spotify/spotify.service';
import { UpdateUserInfosDto } from './dto/update-user-infos.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
    private readonly spotifyService: SpotifyService,
  ) {}

  @Post('create')
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
      const accessToken = await this.spotifyService.getAccessTokenFromCode(code);
      const spotifyUser = await this.spotifyService.getSpotifyUserData(accessToken);
      const newUser = await this.userService.createUserWithSpotify(spotifyUser);

      return res.status(201).json({
        message: 'Inscription réussie via Spotify',
        user: newUser,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de l\'inscription via Spotify',
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
