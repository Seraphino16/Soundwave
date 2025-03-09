import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async setId(): Promise<number> {
    const lastUser = await this.userModel.findOne().sort({ id: -1 }).exec();
    return lastUser ? lastUser.id + 1 : 1;
  }

  async create(
    id: number,
    email: string,
    password: string,
    pseudo: string,
    username: string,
    birthdate: Date | null,
    googleId?: string,
    facebookId?: string,
    twitterId?: string,
    deezerId?: string,
    spotifyId?: string,
    roles: string[] = ['USER'],
    verification_token?: string,
    is_verified: boolean = false,
    is_active: boolean = true,
  ): Promise<User> {
    return await this.userModel.create({
      id,
      email,
      password,
      pseudo,
      username,
      birthdate,
      googleId,
      facebookId,
      twitterId,
      deezerId,
      spotifyId,
      roles,
      verification_token,
      is_verified,
      is_active,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
  async findById(id: number): Promise<User | null> {
    return this.userModel.findOne({ id }).exec();
  }

  async setValidationToken(userId: number, token: string): Promise<boolean> {
    const user = await this.userModel.findOne({ id: userId }).exec();

    if (!user) {
      return false;
    }

    user.verification_token = token;
    await user.save();
    return true;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.userModel.findOne({ verification_token: token }).exec();
  }

  async activateUser(userId: number): Promise<boolean> {
    const user = await this.userModel.findOne({ id: userId }).exec();

    if (!user) {
      return false;
    }

    user.is_verified = true;
    user.is_active = true;
    user.verification_token = '';
    await user.save();
    return true;
  }

  async checkAccountVerification(userId: number): Promise<boolean> {
    const user = await this.userModel.findOne({ id: userId }).exec();

    if (!user) {
      return false;
    }

    if (!user.is_verified || !user.is_active) {
      return false;
    }

    return true;
  }
}
