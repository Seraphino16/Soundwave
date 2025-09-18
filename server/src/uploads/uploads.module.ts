import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const userId = req.body.user_id;
          const fileType = req.body.file_type;
          const fileExtension = file.originalname.split('.').pop();

          const filename = `${userId}-${fileType}.${fileExtension}`;
          cb(null, filename);
        },
      }),
    }),
    TokenModule,
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
