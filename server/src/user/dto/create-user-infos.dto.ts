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

export class CreateUserInfosDto {
  @IsInt()
  user_id: number;

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
  @IsString({ each: true })
  musicStyle?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Object)
  socialLinks?: { [network: string]: string };

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;
}
