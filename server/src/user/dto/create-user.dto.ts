import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
  Matches,
  IsIn,
  IsArray,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { UserErrors } from '../errors/user.errors';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: UserErrors.emailRequired().message })
  @IsEmail({}, { message: UserErrors.emailInvalid().message })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: UserErrors.pseudoRequired().message })
  pseudo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: UserErrors.usernameRequired().message })
  username: string;

  @ApiProperty()
  @IsDateString({}, { message: UserErrors.birthdateInvalid().message })
  birthdate: Date;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: UserErrors.passwordTooShort().message })
  @Matches(/[A-Z]/, { message: UserErrors.passwordUppercase().message })
  @Matches(/[a-z]/, { message: UserErrors.passwordLowercase().message })
  @Matches(/[0-9]/, { message: UserErrors.passwordNumber().message })
  @Matches(/[@$!%*?&]/, { message: UserErrors.passwordSpecialChar().message })
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: UserErrors.passwordsDoNotMatch().message })
  passwordConfirm: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  googleId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  facebookId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  twitterId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  deezerId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  spotifyId: string;

  @ApiProperty()
  @IsArray()
  @IsIn(['USER', 'ADMIN', 'ARTIST', 'BAND'], {
    each: true,
    message: UserErrors.missingRequiredFields().message,
  })
  roles: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  verification_token: string;

  @ApiProperty()
  @IsBoolean()
  is_verified: boolean;

  @ApiProperty()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty()
  @IsDateString()
  createdAt: Date;

  @ApiProperty()
  @IsDateString()
  updatedAt: Date;
}
