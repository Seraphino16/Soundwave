import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfos } from '../entities/user-infos.entity';
import { CreateUserInfosDto } from '../dto/create-user-infos.dto';

@Injectable()
export class UserInfosRepository {
  constructor(
    @InjectModel('UserInfos') private readonly userModel: Model<UserInfos>,
  ) {}

  async setId(): Promise<number> {
    const lastUser = await this.userModel.findOne().sort({ id: -1 }).exec();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return lastUser ? lastUser.id + 1 : 1;
  }

  async create(createUserInfosDto: CreateUserInfosDto): Promise<UserInfos> {
    const newUser = new this.userModel({
      ...createUserInfosDto,
      user_id: createUserInfosDto.user_id,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: await this.setId(),
    });

    return newUser.save();
  }

  async update(
    userId: number,
    updateUserDto: Partial<UserInfos>,
  ): Promise<UserInfos | null> {
    return this.userModel
      .findOneAndUpdate(
        { user_id: userId },
        { ...updateUserDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }
}
