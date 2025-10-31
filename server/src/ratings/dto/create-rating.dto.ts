import { IsString, IsNotEmpty, IsIn, IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['artist', 'album'])
  target_type: 'artist' | 'album';

  @IsString()
  @IsNotEmpty()
  target_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
