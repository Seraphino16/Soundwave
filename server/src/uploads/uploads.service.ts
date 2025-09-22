import { Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
const Sharp = require('sharp');

@Injectable()
export class UploadsService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');
  private readonly allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  constructor() {
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

  getFileUrl(filename: string, subdir?: string): string {
    const base = 'http://localhost:5001/uploads';
    return subdir ? `${base}/${subdir}/${filename}` : `${base}/${filename}`;
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

  private sanitizeName(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private deleteExistingTypeFiles(userDir: string, type: 'profile' | 'banner') {
    if (!fs.existsSync(userDir)) return;
    const suffix = type === 'profile' ? '_pfp' : '_banner';
    const entries = fs.readdirSync(userDir);
    for (const entry of entries) {
      if (entry.endsWith(`${suffix}.webp`) || entry.includes(`${suffix}.`)) {
        fs.unlinkSync(path.join(userDir, entry));
      }
    }
  }

  async processUserImage(
    userId: number,
    username: string | undefined,
    type: 'profile' | 'banner',
    file: Express.Multer.File,
  ): Promise<{ url: string; filePath: string; filename: string }> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    this.validateImageFile(file);

  const suffix = type === 'profile' ? 'pfp' : 'banner';
  const filename = `${userId}_${suffix}.webp`;
    const userDir = path.join(this.uploadPath, 'users', String(userId));
    this.ensureDir(userDir);

    this.deleteExistingTypeFiles(userDir, type);

    const destPath = path.join(userDir, filename);

  await Sharp(file.buffer).webp({ quality: 85 }).toFile(destPath);

  const relativeSubdir = path.posix.join('users', String(userId));
  const url = `${this.getFileUrl(filename, relativeSubdir)}?v=${Date.now()}`;

    return { url, filePath: destPath, filename };
  }
}
