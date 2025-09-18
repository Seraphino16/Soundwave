import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  pseudo?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  musicStyle?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  banner_picture?: string;
}
