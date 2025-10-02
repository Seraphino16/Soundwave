import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  artist_id: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
