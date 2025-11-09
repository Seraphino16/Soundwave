import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { UserRepository } from './repositories/user.repository';
import { UserSettingsRepository } from './repositories/user-settings.repository';
import { UserInfosRepository } from './repositories/user-infos.repository';

import { UserSchema } from './entities/user.entity';
import { UserInfosSchema } from './entities/user-infos.entity';
import { UserSettingsSchema } from './entities/user-settings.entity';

import { MailerModule } from '../mailer/mailer.module';
import { HttpModule } from '@nestjs/axios';
import { TokenModule } from '../token/token.module';
import { UploadsModule } from '../uploads/uploads.module';
import { SpotifyModule } from '../spotify/spotify.module';
import { GoogleModule } from '../google/google.module';
import { UtilsModule } from '../utils/utils.module';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { MailerService } from '../mailer/mailer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserInfos', schema: UserInfosSchema },
      { name: 'UserSettings', schema: UserSettingsSchema },
    ]),
    MailerModule,
    HttpModule,
    TokenModule,
    forwardRef(() => UploadsModule),
    SpotifyModule,
    forwardRef(() => GoogleModule),
    UtilsModule,
  ],
  providers: [
    UserService,
    UserRepository,
    UserInfosRepository,
    UserSettingsRepository,
    JwtAuthGuard,
    MailerService,
  ],
  controllers: [UserController],
  exports: [
    UserRepository,
    UserInfosRepository,
    UserService,
    UserSettingsRepository,
  ],
})
export class UserModule {}
