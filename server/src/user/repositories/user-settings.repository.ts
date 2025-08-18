import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserSettings } from '../entities/user-settings.entity';

@Injectable()
export class UserSettingsRepository {
  constructor(
    @InjectModel('UserSettings')
    private readonly userModel: Model<UserSettings>,
  ) {}

  async setId(): Promise<number> {
    const last = await this.userModel.findOne().sort({ id: -1 }).exec();
    return last ? last.id + 1 : 1;
  }

  async createSettings(user_id: number): Promise<UserSettings> {
    const newId = await this.setId();
    const settings = new this.userModel({
      id: newId,
      user_id,
      theme: 'light',
      profileVisibility: 'public',
      language: 'fr',
    });
    return settings.save();
  }

  async getSettingsByUserId(user_id: number): Promise<UserSettings | null> {
    return this.userModel.findOne({ user_id }).exec();
  }

  async updateSettingsByUserId(
    user_id: number,
    updateData: Partial<
      Pick<UserSettings, 'theme' | 'profileVisibility' | 'language'>
    >,
  ): Promise<UserSettings | null> {
    return this.userModel
      .findOneAndUpdate(
        { user_id },
        { ...updateData, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }
}
