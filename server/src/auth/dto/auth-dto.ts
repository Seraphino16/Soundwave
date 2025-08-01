import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
