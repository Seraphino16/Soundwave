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
import { diskStorage } from 'multer';
import { TokenService } from '../token/token.service';
import * as path from 'path';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uploadsService = new UploadsService();
          const filename = uploadsService.generateFileName(file.originalname, 'upload');
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const uploadsService = new UploadsService();
        try {
          uploadsService.validateImageFile(file);
          cb(null, true);
        } catch (error) {
          cb(error, false);
        }
      },
    }),
  )
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

    const fileUrl = this.uploadsService.getFileUrl(file.filename);

    return {
      message: 'Fichier uploadé avec succès',
      url: fileUrl,
      filePath: `uploads/${file.filename}`,
    };
  }

  @Post('profile-picture/:userId')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uploadsService = new UploadsService();
          const filename = uploadsService.generateFileName(file.originalname, 'profile');
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const uploadsService = new UploadsService();
        try {
          uploadsService.validateImageFile(file);
          cb(null, true);
        } catch (error) {
          cb(error, false);
        }
      },
    }),
  )
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

    const fileUrl = this.uploadsService.getFileUrl(file.filename);

    return {
      message: 'Photo de profil uploadée avec succès',
      url: fileUrl,
    };
  }

  @Post('banner-picture/:userId')
  @UseInterceptors(
    FileInterceptor('bannerPicture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uploadsService = new UploadsService();
          const filename = uploadsService.generateFileName(file.originalname, 'banner');
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const uploadsService = new UploadsService();
        try {
          uploadsService.validateImageFile(file);
          cb(null, true);
        } catch (error) {
          cb(error, false);
        }
      },
    }),
  )
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

    const fileUrl = this.uploadsService.getFileUrl(file.filename);

    return {
      message: 'Bannière uploadée avec succès',
      url: fileUrl,
    };
  }
}
