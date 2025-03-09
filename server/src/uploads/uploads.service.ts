import { Injectable } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class UploadsService {
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
}
