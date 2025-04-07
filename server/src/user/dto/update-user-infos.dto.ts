import { IsOptional, IsString, IsArray, IsDateString } from 'class-validator';

export class UpdateUserInfosDto {
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsOptional()
  @IsString()
  banner_picture?: string;

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
