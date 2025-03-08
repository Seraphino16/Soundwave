import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfos } from '../entities/user-infos.entity';
import { CreateUserInfosDto } from '../dto/create-user-infos';

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

  async create(createUserDto: CreateUserInfosDto): Promise<UserInfos> {
    const newUser = new this.userModel({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: await this.setId(),
    });

    return newUser.save();
  }

  async update(
    userId: number,
    updateUserDto: Partial<CreateUserInfosDto>,
  ): Promise<UserInfos | null> {
    return await this.userModel
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
}
