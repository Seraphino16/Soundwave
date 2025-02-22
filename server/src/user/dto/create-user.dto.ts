import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, Matches, IsIn, IsArray, IsBoolean, IsDateString } from 'class-validator';
import { UserErrors } from '../errors/user.errors';

export class CreateUserDto {

    @IsNotEmpty({ message: UserErrors.emailRequired().message })
    @IsEmail({}, { message: UserErrors.emailInvalid().message })
    email: string;

    @IsString()
    @IsNotEmpty({ message: UserErrors.pseudoRequired().message })
    pseudo: string;

    @IsString()
    @IsNotEmpty({ message: UserErrors.usernameRequired().message })
    username: string;

    @IsDateString({}, { message: UserErrors.birthdateInvalid().message })
    birthdate: Date;

    @IsString()
    @MinLength(6, { message: UserErrors.passwordTooShort().message })
    @Matches(/[A-Z]/, { message: UserErrors.passwordUppercase().message })
    @Matches(/[a-z]/, { message: UserErrors.passwordLowercase().message })
    @Matches(/[0-9]/, { message: UserErrors.passwordNumber().message })
    @Matches(/[@$!%*?&]/, { message: UserErrors.passwordSpecialChar().message })
    @IsOptional()
    password: string;

    @IsString()
    @IsNotEmpty({ message: UserErrors.passwordsDoNotMatch().message })
    passwordConfirm: string;

    @IsString()
    @IsOptional()
    googleId: string;

    @IsString()
    @IsOptional()
    facebookId: string;

    @IsString()
    @IsOptional()
    twitterId: string;

    @IsString()
    @IsOptional()
    deezerId: string;

    @IsString()
    @IsOptional()
    spotifyId: string;

    @IsArray()
    @IsIn(['USER', 'ADMIN', 'ARTIST', 'BAND'], { each: true, message: UserErrors.missingRequiredFields().message })
    roles: string[];

    @IsString()
    @IsOptional()
    verification_token: string;

    @IsBoolean()
    is_verified: boolean;

    @IsBoolean()
    is_active: boolean;

    @IsDateString()
    createdAt: Date;

    @IsDateString()
    updatedAt: Date;
}
