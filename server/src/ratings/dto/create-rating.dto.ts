import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  @IsNotEmpty()
  artist_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
