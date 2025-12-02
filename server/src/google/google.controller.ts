import { Controller, Get } from '@nestjs/common';

@Controller('google')
export class GoogleController {
  @Get('create/google')
  redirectToGoogleAuth() {
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.REACT_APP_API_BASE_URL}/users/create/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    return { url: `${baseUrl}?${params.toString()}` };
  }
}
