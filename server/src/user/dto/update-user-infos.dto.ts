// src/user/dto/update-user-infos.dto.ts
import { IsOptional, IsString, IsArray, IsDateString } from 'class-validator';

export class UpdateUserInfosDto {
  @IsOptional()
  @IsString()
  profile_picture?: { message: string; filePath: string };

  @IsOptional()
  @IsString()
  banner_picture?: { message: string; filePath: string };

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  musicStyle?: string[];

  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}
