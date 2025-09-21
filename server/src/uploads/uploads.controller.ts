import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { Express, Request } from 'express';
import { TokenService } from '../token/token.service';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const token = req.cookies?.token;
    if (!token) {
      throw new BadRequestException('Accès non autorisé');
    }

    try {
      this.tokenService.verifyToken(token);
    } catch (error) {
      throw new BadRequestException('Token invalide');
    }

    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const payload: any = this.tokenService.verifyToken(token);
    const typeParam = (req.query?.type as string) || 'profile';
    const type = typeParam === 'banner' ? 'banner' : 'profile';
    const result = await this.uploadsService.processUserImage(payload.id, payload.username, type, file);

    return {
      message: 'Fichier uploadé avec succès',
      url: result.url,
      filename: result.filename,
    };
  }

  @Post('profile-picture/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const token = req.cookies?.token;
    if (!token) {
      throw new BadRequestException('Accès non autorisé');
    }

    try {
      const payload = this.tokenService.verifyToken(token);
      if (payload.id !== parseInt(userId)) {
        throw new BadRequestException('Accès non autorisé');
      }
    } catch (error) {
      throw new BadRequestException('Token invalide');
    }

    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const payload: any = this.tokenService.verifyToken(token);
    const result = await this.uploadsService.processUserImage(parseInt(userId), payload.username, 'profile', file);

    return {
      message: 'Photo de profil uploadée avec succès',
  url: result.url,
  filename: result.filename,
    };
  }

  @Post('banner-picture/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBannerPicture(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const token = req.cookies?.token;
    if (!token) {
      throw new BadRequestException('Accès non autorisé');
    }

    try {
      const payload = this.tokenService.verifyToken(token);
      if (payload.id !== parseInt(userId)) {
        throw new BadRequestException('Accès non autorisé');
      }
    } catch (error) {
      throw new BadRequestException('Token invalide');
    }

    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const payload: any = this.tokenService.verifyToken(token);
    const result = await this.uploadsService.processUserImage(parseInt(userId), payload.username, 'banner', file);

    return {
      message: 'Bannière uploadée avec succès',
  url: result.url,
  filename: result.filename,
    };
  }
}
