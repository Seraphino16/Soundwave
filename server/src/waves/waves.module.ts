import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WavesService } from './waves.service';
import { WavesController } from './waves.controller';
import { WaveSchema } from './wave.schema';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Wave', schema: WaveSchema }]), TokenModule],
  providers: [WavesService],
  controllers: [WavesController],
  exports: [WavesService],
})
export class WavesModule {}
