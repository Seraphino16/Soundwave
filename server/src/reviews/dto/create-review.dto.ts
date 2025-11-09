import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['artist', 'album'])
  target_type: 'artist' | 'album';

  @IsNotEmpty()
  @IsString()
  target_id: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
