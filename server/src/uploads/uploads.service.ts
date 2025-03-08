import { Injectable } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class UploadsService {
  handleFileUpload(file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filePath: file.path,
    };
  }
}
