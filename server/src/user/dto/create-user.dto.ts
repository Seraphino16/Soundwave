import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, Matches, IsIn, IsArray, IsBoolean, IsDateString } from 'class-validator';
import { UserErrors } from '../errors/user.errors';

export class CreateUserDto {
    @IsNotEmpty({ message: UserErrors.EMAIL_REQUIRED })
    @IsEmail({}, { message: UserErrors.EMAIL_INVALID })
    email: string;

    @IsString()
    @IsNotEmpty({ message: UserErrors.PSEUDO_REQUIRED })
    pseudo: string;

    @IsString()
    @IsNotEmpty({ message: UserErrors.USERNAME_REQUIRED })
    username: string;

    @IsDateString({}, { message: UserErrors.BIRTHDATE_INVALID })
    birthdate: Date;

    @IsString()
    @MinLength(6, { message: UserErrors.PASSWORD_TOO_SHORT })
    @Matches(/[A-Z]/, { message: UserErrors.PASSWORD_UPPERCASE })
    @Matches(/[a-z]/, { message: UserErrors.PASSWORD_LOWERCASE })
    @Matches(/[0-9]/, { message: UserErrors.PASSWORD_NUMBER })
    @Matches(/[@$!%*?&]/, { message: UserErrors.PASSWORD_SPECIAL_CHAR })
    password: string;

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
    @IsIn(['USER', 'ADMIN', 'ARTIST', 'BAND'], { each: true })
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
