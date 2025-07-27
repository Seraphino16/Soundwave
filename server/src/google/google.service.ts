import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { UserService } from '../user/user.service';
import { UserErrors } from '../user/errors/user.errors';

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
          redirect_uri: 'http://localhost:5001/users/create/google/callback',
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
}
