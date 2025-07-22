import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MailerModule } from '../mailer/mailer.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserSchema } from './entities/user.entity';
import { UserInfosSchema } from './entities/user-infos.entity';
import { TokenModule } from '../token/token.module';
import { UserInfosRepository } from './repositories/user-infos.repository';
import { UploadsModule } from '../uploads/uploads.module';
import { SpotifyModule } from '../spotify/spotify.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserInfos', schema: UserInfosSchema },
    ]),
    MailerModule,
    HttpModule,
    TokenModule,
    UploadsModule,
    SpotifyModule,
  ],
  providers: [UserService, UserRepository, UserInfosRepository],
  controllers: [UserController],
  exports: [UserRepository, UserInfosRepository, UserService],
})
export class UserModule {}

