import {
  IsString,
  IsOptional,
  IsArray,
  IsInt,
  IsDate,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInfosDto {
  @ApiProperty()
  @IsInt()
  user_id: number;

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
  @IsString({ each: true })
  musicStyle?: string[];

  @ApiProperty()
  @IsOptional()
  @IsObject()
  socialLinks?: { [network: string]: string };

  @ApiProperty()
  @IsDate()
  createdAt?: Date;

  @ApiProperty()
  @IsDate()
  updatedAt?: Date;
}
