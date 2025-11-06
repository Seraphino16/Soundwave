/**
 * @description DTO pour créer une wave
 * @author SoundWave
 */

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWaveDto {
  @ApiProperty({
    description: 'Le contenu de la wave',
    example: 'Je viens de découvrir ce super album! 🎵',
    maxLength: 500
  })
  @IsNotEmpty({ message: 'Le contenu ne peut pas être vide' })
  @IsString()
  @MaxLength(500, { message: 'Le contenu ne peut pas dépasser 500 caractères' })
  content: string;
}