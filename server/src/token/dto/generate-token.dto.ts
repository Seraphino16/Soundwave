import { IsEmail, IsString, IsNotEmpty, IsInt, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GenerateTokenDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsArray()
  roles: string[];
}
