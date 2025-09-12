import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @IsNotEmpty()
  artist_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
