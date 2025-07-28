/**
 * @description Controller d'authentification
 * @author SoundWave
 */

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
  async login(@Body() loginDto: AuthDto, @Res() res) {
    try {
      const loginResponse = await this.authService.login(loginDto);

      res.clearCookie('token', { path: '/' });

      res.cookie('token', loginResponse.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000,
        path: '/',
      });

      console.log('Cookie set for token:', loginResponse.token);

      return res.status(200).json({
        success: true,
        message: 'Connexion réussie',
      });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides',
      });
    }
  }

  @Get('/spotify')
  redirectToSpotifyAuthForLogin(@Query('isLogin') isLogin: boolean = false) {
    const authUrl = this.spotifyService.generateSpotifyAuthUrl(true);
    return { url: authUrl };
  }

  @Get('spotify/callback')
  async spotifyLoginCallback(@Query('code') code: string, @Res() res) {
    try {
      const accessToken = await this.spotifyService.getAccessTokenFromCode(
        code,
        true,
      );
      const spotifyUser =
        await this.spotifyService.getSpotifyUserData(accessToken);
      const loginDto = { email: spotifyUser.email } as AuthDto;
      const loginResponse = await this.authService.login(loginDto);

      res.clearCookie('token', { path: '/' });

      res.cookie('token', loginResponse.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000,
        path: '/',
      });
      console.log('Cookie set for token:', loginResponse.token);
      return res.redirect('http://localhost:3000/home');
    } catch (error) {
      return res.redirect('http://localhost:3000/error');
    }
  }

  @Post('logout')
  logout(@Res() res) {
    console.log('Déconnexion demandée');

    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    console.log('Cookie token supprimé');

    return res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    });
  }
}
