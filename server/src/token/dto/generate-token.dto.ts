import { IsEmail, IsString, IsNotEmpty, IsInt } from 'class-validator';

export class GenerateTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsInt()
  @IsNotEmpty()
  id: number;
}
