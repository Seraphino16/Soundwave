/**
 * @description Module pour gérer les waves
 * @author SoundWave
 */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WavesController } from './waves.controller';
import { WavesService } from './waves.service';
import { WaveSchema } from './entities/wave.entity';
import { AuthModule } from '../auth/auth.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Wave', schema: WaveSchema }]),
    AuthModule,
    TokenModule,
  ],
  controllers: [WavesController],
  providers: [WavesService],
  exports: [WavesService],
})
export class WavesModule {}