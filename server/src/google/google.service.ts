import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { UserService } from '../user/user.service';

@Injectable()
export class GoogleService {
  constructor(private readonly userService: UserService) {}

  async registerWithGoogle(code: string) {
    try {
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.REACT_APP_API_BASE_URL}/users/create/google/callback`,
          grant_type: 'authorization_code',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const { access_token } = tokenResponse.data;

      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const profile = userInfoResponse.data;

      const newUser =
        await this.userService.createUserWithGoogleProfile(profile);

      return newUser;
    } catch (err) {
      throw new InternalServerErrorException(
        'Erreur lors de la création du compte Google',
      );
    }
  }

  async getGoogleProfile(code: string) {
    try {
      const tokenResponse = await axios.post(
        'https://oauth2.googleapis.com/token',
        new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.REACT_APP_API_BASE_URL}/auth/google/callback`,
          grant_type: 'authorization_code',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      const { access_token } = tokenResponse.data;

      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      return userInfoResponse.data;
    } catch (err) {
      throw new Error('Erreur lors de la récupération du profil Google');
    }
  }
}
