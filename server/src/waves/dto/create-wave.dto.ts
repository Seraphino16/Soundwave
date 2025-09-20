import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWaveDto {
  @IsNotEmpty()
  @IsString()
  artist_id: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
