import {
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInfosDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  profile_picture?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  banner_picture?: string;

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
  @IsObject()
  socialLinks?: { [network: string]: string };

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  updatedAt?: Date;
}
