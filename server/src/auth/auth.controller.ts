import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth-dto';
import { SpotifyService } from '../spotify/spotify.service';
import { GoogleService } from '../google/google.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly spotifyService: SpotifyService,
    private readonly googleService: GoogleService,
  ) {}

  @Post('')
  async login(@Body() loginDto: AuthDto, @Res() res) {
    try {
      const loginResponse = await this.authService.login(loginDto);

      res.clearCookie('token', {
        path: '/',
        sameSite: 'none',
        secure: true,
      });

      res.cookie('token', loginResponse.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 24 * 7 * 1000,
        path: '/',
      });


      return res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        token: loginResponse.token,
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
        secure: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 24 * 7 * 1000,
        path: '/',
      });
      return res.redirect('http://localhost:3000/home');
    } catch (error) {
      return res.redirect('http://localhost:3000/error');
    }
  }

  @Post('logout')
  logout(@Res() res) {

    res.clearCookie('token', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });


    return res.status(200).json({
      success: true,
      message: 'Déconnexion réussie',
    });
  }

  @Get('/google')
  redirectToGoogleAuthForLogin(@Query('isLogin') isLogin: boolean = true) {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri:
        process.env.REACT_APP_API_BASE_URL + '/auth/google/callback',
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return { url: `${baseUrl}?${params.toString()}` };
  }

  @Get('/google/callback')
  async googleLoginCallback(@Query('code') code: string, @Res() res) {
    try {
      const profile = await this.googleService.getGoogleProfile(code);
      const loginDto = { email: profile.email } as AuthDto;
      const loginResponse = await this.authService.login(loginDto);

      return res.status(200).json({
        message: 'Connexion réussie via Google',
        token: loginResponse.token,
        user: loginResponse.user,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Erreur lors de la connexion via Google',
        error: error.message,
      });
    }
  }
}
