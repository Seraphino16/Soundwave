import { IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}
