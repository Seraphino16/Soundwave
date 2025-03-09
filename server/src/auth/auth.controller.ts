import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth-dto';
import { SpotifyService } from '../spotify/spotify.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly spotifyService: SpotifyService,
  ) {}

  @Post('')
  async login(@Body() loginDto: AuthDto) {
    return this.authService.login(loginDto);
  }

  @Get('/spotify')
  redirectToSpotifyAuthForLogin(@Query('isLogin') isLogin: boolean = false) {
    const authUrl = this.spotifyService.generateSpotifyAuthUrl(true);
    return { url: authUrl };
  }

  @Get('spotify/callback')
  async spotifyLoginCallback(@Query('code') code: string, @Res() res) {
    try {

      const accessToken = await this.spotifyService.getAccessTokenFromCode(code, true);
      const spotifyUser = await this.spotifyService.getSpotifyUserData(accessToken);
      const loginDto = { email: spotifyUser.email } as AuthDto;
      const loginResponse = await this.authService.login(loginDto);

      return res.status(200).json({
        message: 'Connexion réussie via Spotify',
        token: loginResponse.token,
        user: loginResponse.user,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la connexion via Spotify',
        error: error.message,
      });
    }
  }

}
