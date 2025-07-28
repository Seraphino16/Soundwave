import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { SpotifyService } from '../spotify/spotify.service';
import { GoogleModule } from '../google/google.module';

@Module({
  imports: [UserModule, TokenModule, GoogleModule],
  controllers: [AuthController],
  providers: [AuthService, SpotifyService],
  exports: [AuthService],
})
export class AuthModule {}
