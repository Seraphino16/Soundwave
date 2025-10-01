import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfos } from '../entities/user-infos.entity';
import { CreateUserInfosDto } from '../dto/create-user-infos.dto';
import { UpdateUserInfosDto } from '../dto/update-user-infos.dto';

@Injectable()
export class UserInfosRepository {
  constructor(
    @InjectModel('UserInfos') private readonly userModel: Model<UserInfos>,
  ) {}

  async setId(): Promise<number> {
    const last = await this.userModel.findOne().sort({ id: -1 }).exec();
    return last ? last.id + 1 : 1;
  }

  async create(createUserInfosDto: CreateUserInfosDto): Promise<UserInfos> {
    const newUserInfos = new this.userModel({
      ...createUserInfosDto,
      id: await this.setId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newUserInfos.save();
  }

  async update(
    userId: number,
    updateUserDto: Partial<UpdateUserInfosDto>,
  ): Promise<UserInfos | null> {
    return this.userModel
      .findOneAndUpdate(
        { user_id: userId },
        {
          ...updateUserDto,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();
  }

  async findByUserId(userId: number): Promise<UserInfos | null> {
    return this.userModel.findOne({ user_id: userId }).exec();
  }

  async findByUserIds(userIds: number[]): Promise<UserInfos[]> {
    return this.userModel.find({ user_id: { $in: userIds } }).exec();
  }
}
