import { IsOptional, IsIn, IsArray, IsBoolean } from 'class-validator';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsArray({ message: 'Les roles doivent être un tableau' })
  @IsIn(['USER', 'ARTIST', 'BAND', 'ADMIN'], { each: true })
  roles?: string[];

  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
