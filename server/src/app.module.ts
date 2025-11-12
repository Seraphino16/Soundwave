import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MailerService } from './mailer/mailer.service';
import { MailerModule } from './mailer/mailer.module';
import { TokenModule } from './token/token.module';
import { SpotifyService } from './spotify/spotify.service';
import { SpotifyController } from './spotify/spotify.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UploadsService } from './uploads/uploads.service';
import { UploadsController } from './uploads/uploads.controller';
import { UploadsModule } from './uploads/uploads.module';
import { SpotifyModule } from './spotify/spotify.module';
import { GoogleService } from './google/google.service';
import { GoogleController } from './google/google.controller';
import { GoogleModule } from './google/google.module';
import { UtilsModule } from './utils/utils.module';
import { RatingsModule } from './ratings/ratings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WavesModule } from './waves/waves.module';
import { EventsModule } from './events/events.module';
import { DiscussionsModule } from './discussions/discussions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TokenModule,
    MailerModule,
    AuthModule,
    UploadsModule,
    SpotifyModule,
    GoogleModule,
    UtilsModule,
    RatingsModule,
    ReviewsModule,
    WavesModule,
    EventsModule,
    DiscussionsModule,
  ],
  controllers: [
    AppController,
    SpotifyController,
    AuthController,
    UploadsController,
    GoogleController,
  ],
  providers: [
    AppService,
    MailerService,
    SpotifyService,
    UploadsService,
    GoogleService,
  ],
})
export class AppModule {}
