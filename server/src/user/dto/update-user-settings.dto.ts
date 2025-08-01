import { IsOptional, IsIn } from 'class-validator';

export class UpdateUserSettingsDto {
  @IsOptional()
  @IsIn(['dark', 'light'])
  theme?: 'dark' | 'light';

  @IsOptional()
  @IsIn(['public', 'private'])
  profileVisibility?: 'public' | 'private';

  @IsOptional()
  @IsIn(['fr', 'en'])
  language?: 'fr' | 'en';
}
