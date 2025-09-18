import { Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadsService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');
  private readonly allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    // Créer le dossier uploads s'il n'existe pas
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  handleFileUpload(
    file: Express.Multer.File,
  ): { message: string; filePath: string } | undefined {
    if (!file) {
      return undefined;
    }

    return {
      message: 'File uploaded successfully',
      filePath: file.path,
    };
  }

  validateImageFile(file: any): void {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Format de fichier non supporté. Utilisez JPG, PNG ou WebP');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('Le fichier est trop volumineux. Taille maximale: 5MB');
    }
  }

  generateFileName(originalName: string, prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = path.extname(originalName);
    return `${prefix}-${timestamp}-${random}${extension}`;
  }

  getFileUrl(filename: string): string {
    return `http://localhost:5001/uploads/${filename}`;
  }

  deleteFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  }
}
