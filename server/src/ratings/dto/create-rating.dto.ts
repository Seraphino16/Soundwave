import { IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({ example: '3fj29fj32', description: "ID de l'artiste (Spotify ou interne)" })
  @IsString()
  artistId: string;

  @ApiProperty({ example: 1, description: "ID de l'utilisateur" })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 'JohnDoe', description: "Nom d'utilisateur qui note" })
  @IsString()
  username: string;

  @ApiProperty({ example: 4, description: 'Note attribuée (1–5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;
}
