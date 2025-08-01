import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserErrors } from '../errors/user.errors';

export class ChangePasswordDto {
  @IsString()
  @IsOptional()
  oldPassword: string;

  @IsString()
  @MinLength(6, { message: UserErrors.passwordTooShort().message })
  @Matches(/[A-Z]/, { message: UserErrors.passwordUppercase().message })
  @Matches(/[a-z]/, { message: UserErrors.passwordLowercase().message })
  @Matches(/[0-9]/, { message: UserErrors.passwordNumber().message })
  @Matches(/[@$!%*?&]/, { message: UserErrors.passwordSpecialChar().message })
  @IsOptional()
  newPassword: string;

  @ApiProperty({
    description: 'Confirmation du mot de passe',
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty({ message: UserErrors.passwordsDoNotMatch().message })
  confirmPassword: string;
}
