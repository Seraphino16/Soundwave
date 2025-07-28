import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
  Matches,
  IsIn,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { UserErrors } from '../errors/user.errors';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  id?: number;

  @IsNotEmpty({ message: UserErrors.emailRequired().message })
  @IsEmail({}, { message: UserErrors.emailInvalid().message })
  email: string;

  @ApiProperty({ description: "Nom de l'utilisateur", example: 'John Doe' })
  @IsString()
  @IsNotEmpty({ message: UserErrors.pseudoRequired().message })
  pseudo: string;

  @ApiProperty({ description: "Nom d'utilisateur", example: 'johndoe' })
  @IsString()
  @IsNotEmpty({ message: UserErrors.usernameRequired().message })
  username: string;

  @ApiProperty({
    description: "Date de naissance de l'utilisateur",
    example: '1990-01-01',
  })
  @IsDateString({}, { message: UserErrors.birthdateInvalid().message })
  birthdate: Date;

  @ApiProperty({
    description:
      "Mot de passe de l'utilisateur (doit contenir au moins 6 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial)",
    example: 'Password123!',
  })
  @IsString()
  @MinLength(6, { message: UserErrors.passwordTooShort().message })
  @Matches(/[A-Z]/, { message: UserErrors.passwordUppercase().message })
  @Matches(/[a-z]/, { message: UserErrors.passwordLowercase().message })
  @Matches(/[0-9]/, { message: UserErrors.passwordNumber().message })
  @Matches(/[@$!%*?&]/, { message: UserErrors.passwordSpecialChar().message })
  @IsOptional()
  password: string;

  @ApiProperty({
    description: 'Confirmation du mot de passe',
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty({ message: UserErrors.passwordsDoNotMatch().message })
  passwordConfirm: string;

  @ApiProperty({
    description: "Identifiant Google de l'utilisateur",
    example: 'google-id-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  googleId: string;

  @ApiProperty({
    description: "Identifiant Facebook de l'utilisateur",
    example: 'facebook-id-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  facebookId: string;

  @ApiProperty({
    description: "Identifiant Twitter de l'utilisateur",
    example: 'twitter-id-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  twitterId: string;

  @ApiProperty({
    description: "Identifiant Deezer de l'utilisateur",
    example: 'deezer-id-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  deezerId: string;

  @ApiProperty({
    description: "Identifiant Spotify de l'utilisateur",
    example: 'spotify-id-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  spotifyId: string;

  @IsIn(['USER', 'ADMIN', 'ARTIST', 'BAND'], {
    each: true,
    message: UserErrors.missingRequiredFields().message,
  })
  roles: string[];

  @ApiProperty({
    description: "Token de vérification de l'utilisateur",
    example: 'verification-token-123',
    required: false,
  })
  @IsString()
  @IsOptional()
  verification_token: string;

  @ApiProperty({
    description: "Indique si l'utilisateur est vérifié",
    example: true,
  })
  @IsBoolean()
  is_verified: boolean;

  @ApiProperty({
    description: "Indique si l'utilisateur est actif",
    example: true,
  })
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({
    description: "Date de création de l'utilisateur",
    example: '2023-01-01T00:00:00Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: "Date de mise à jour de l'utilisateur",
    example: '2023-01-01T00:00:00Z',
  })
  @IsDateString()
  updatedAt: Date;
}
