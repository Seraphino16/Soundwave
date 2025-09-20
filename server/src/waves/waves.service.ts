import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wave } from './wave.schema';
import { CreateWaveDto } from './dto/create-wave.dto';

@Injectable()
export class WavesService {
  constructor(@InjectModel('Wave') private waveModel: Model<Wave>) {}

  async create(
    dto: CreateWaveDto,
    userId: number,
    username: string,
    profile_picture: string,
  ) {
    try {
      const wave = new this.waveModel({
        artist_id: dto.artist_id,
        user_id: userId,
        username,
        profile_picture,
        message: dto.message,
      });
      return await wave.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException(
          'Vous avez déjà publié une wave pour cet artiste',
        );
      }
      throw err;
    }
  }

  async findAllByArtist(artistId: string) {
    return this.waveModel.find({ artist_id: artistId }).sort({ createdAt: -1 }).exec();
  }

  async findUserWave(artistId: string, userId: number) {
    return this.waveModel.findOne({ artist_id: artistId, user_id: userId }).exec();
  }

  async update(id: string, message: string, userId: number) {
    const wave = await this.waveModel.findById(id).exec();
    if (!wave) throw new NotFoundException('Wave non trouvée');
    if (wave.user_id !== userId) {
      throw new ConflictException('Vous ne pouvez modifier que vos propres waves');
    }
    wave.message = message;
    return wave.save();
  }

  async remove(id: string, userId: number) {
    const wave = await this.waveModel.findById(id).exec();
    if (!wave) throw new NotFoundException('Wave non trouvée');
    if (wave.user_id !== userId) {
      throw new ConflictException('Vous ne pouvez supprimer que vos propres waves');
    }
    return wave.deleteOne();
  }
}
