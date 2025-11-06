/**
 * @description Service pour gérer les waves (posts musicaux)
 * @author SoundWave
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wave } from './entities/wave.entity';
import { CreateWaveDto } from './dto/create-wave.dto';

@Injectable()
export class WavesService {
  constructor(
    @InjectModel('Wave')
    private readonly waveModel: Model<Wave>,
  ) {}

  /**
   * @description Générer un nouvel ID unique pour chaque wave
   */
  private async setId(): Promise<number> {
    const lastWave = await this.waveModel.findOne().sort({ id: -1 }).exec();
    return lastWave ? lastWave.id + 1 : 1;
  }

  /**
   * @description Créer une nouvelle wave
   */
  async create(userId: number, createWaveDto: CreateWaveDto): Promise<Wave> {
    const id = await this.setId();
    
    const wave = new this.waveModel({
      id,
      userId,
      content: createWaveDto.content,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      visibility: true,
    });

    return await wave.save();
  }

  /**
   * @description Récupérer le feed de waves (ordre chronologique inversé)
   */
  async getFeed(page: number = 1, limit: number = 10): Promise<{ waves: any[], total: number }> {
    const skip = (page - 1) * limit;

    const waves = await this.waveModel
      .find({ visibility: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    console.log('🌊 Waves brutes depuis MongoDB:', JSON.stringify(waves, null, 2));

    const total = await this.waveModel.countDocuments({ visibility: true });

    const User = this.waveModel.db.collection('users');
    
    const userIds = [...new Set(waves.map(w => {
      const waveObj: any = w.toObject ? w.toObject() : w;
      return waveObj.userId || waveObj.user_id || (Array.isArray(waveObj.user_id) ? waveObj.user_id[0] : null);
    }).filter(Boolean))];    
    const users = await User.find({ id: { $in: userIds } }).toArray();
    const UserInfos = this.waveModel.db.collection('userinfos');
    const userInfos = await UserInfos.find({ user_id: { $in: userIds } }).toArray();
    const userInfosMap = new Map();
    userInfos.forEach(ui => userInfosMap.set(ui.user_id, ui));
    const userMap = new Map();
    users.forEach(u => {
      const userInfo = userInfosMap.get(u.id);
      userMap.set(u.id, {
        id: u.id,
        pseudo: u.pseudo,
        username: u.username,
        email: u.email,
        profile_picture: userInfo?.profile_picture || null,
        is_verified: u.is_verified
      });
    });
    const mappedWaves = waves.map(wave => {
      const waveObj: any = wave.toObject();
      const actualUserId = waveObj.userId || waveObj.user_id || (Array.isArray(waveObj.user_id) ? waveObj.user_id[0] : null);
      const userData = userMap.get(actualUserId);
      return {
        ...waveObj,
        user: userData || null,
      };
    });

    return { waves: mappedWaves, total };
  }

  /**
   * @descriptionRécupérer les waves d'un utilisateur spécifique
   */
  async getUserWaves(userId: number, page: number = 1, limit: number = 10): Promise<{ waves: any[], total: number }> {
    const skip = (page - 1) * limit;
    const waves = await this.waveModel
      .find({ $or: [{ userId }, { user_id: userId }], visibility: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.waveModel.countDocuments({ $or: [{ userId }, { user_id: userId }], visibility: true });
    const User = this.waveModel.db.collection('users');
    const userIds = [...new Set(waves.map(w => {
      const waveObj: any = w.toObject ? w.toObject() : w;
      return waveObj.userId || waveObj.user_id || (Array.isArray(waveObj.user_id) ? waveObj.user_id[0] : null);
    }).filter(Boolean))];
    const users = await User.find({ id: { $in: userIds } }).toArray();
    const UserInfos = this.waveModel.db.collection('userinfos');
    const userInfos = await UserInfos.find({ user_id: { $in: userIds } }).toArray();
    const userInfosMap = new Map();
    userInfos.forEach(ui => userInfosMap.set(ui.user_id, ui));
    const userMap = new Map();
    users.forEach(u => {
      const userInfo = userInfosMap.get(u.id);
      userMap.set(u.id, {
        id: u.id,
        pseudo: u.pseudo,
        username: u.username,
        email: u.email,
        profile_picture: userInfo?.profile_picture || null,
        is_verified: u.is_verified
      });
    });
    const mappedWaves = waves.map(wave => {
      const waveObj: any = wave.toObject();
      const actualUserId = waveObj.userId || waveObj.user_id || (Array.isArray(waveObj.user_id) ? waveObj.user_id[0] : null);
      const userData = userMap.get(actualUserId);
      return {
        ...waveObj,
        user: userData || null,
      };
    });

    return { waves: mappedWaves, total };
  }

  /**
   * @description Récupérer une wave par son ID
   */
  async findOne(id: number): Promise<Wave> {
    const wave = await this.waveModel
      .findOne({ id })
      .exec();

    if (!wave) {
      throw new NotFoundException(`Wave #${id} not found`);
    }

    return wave;
  }

  /**
   * @descriptionSupprimer une wave
   */
  async remove(id: number, userId: number): Promise<void> {
    const wave = await this.findOne(id);

    if (wave.userId !== userId) {
      throw new BadRequestException('Vous ne pouvez supprimer que vos propres waves');
    }

    await this.waveModel.findOneAndDelete({ id });
  }

  /**
   * @description Liker/disliker une wave
   */
  async toggleLike(id: number, increment: boolean): Promise<Wave> {
    const wave = await this.findOne(id);

    if (increment) {
      wave.likeCount += 1;
    } else {
      wave.likeCount = Math.max(0, wave.likeCount - 1);
    }

    return await wave.save();
  }
}