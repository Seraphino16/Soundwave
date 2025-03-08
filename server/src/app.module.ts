import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MailerService } from './mailer/mailer.service';
import { MailerController } from './mailer/mailer.controller';
import { MailerModule } from './mailer/mailer.module';
import { TokenModule } from './token/token.module';
import { SpotifyService } from './spotify/spotify.service';
import { SpotifyController } from './spotify/spotify.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import {TokenService} from "./token/token.service";
import {TokenController} from "./token/token.controller";

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
  ],
  controllers: [AppController, MailerController, TokenController, SpotifyController, AuthController],
  providers: [AppService, MailerService, TokenService, SpotifyService],
})
export class AppModule {}
