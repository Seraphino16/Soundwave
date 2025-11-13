import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  VerifyCallback,
  StrategyOptionsWithRequest,
} from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.REACT_APP_API_BASE_URL}/auth/google/callback`,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
