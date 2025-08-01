import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../entities/user.entity';
import { UserRole } from '../../config/user.config';
import { UserErrors } from '../errors/user.errors';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async setId(): Promise<number> {
    const lastUser = await this.userModel.findOne().sort({ id: -1 }).exec();
    return lastUser ? lastUser.id + 1 : 1;
  }

  async create(userData: Partial<CreateUserDto>): Promise<User> {
    return this.userModel.create({
      ...userData,
      createdAt: userData.createdAt ?? new Date(),
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

  async assignRole(userId: number, role: UserRole): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException(UserErrors.userNotFound().message);
    }

    if (user.roles.includes(role)) {
      throw new BadRequestException(UserErrors.alreadyArtistError().message);
    }

    if (role === UserRole.BAND && !user.roles.includes(UserRole.ARTIST)) {
      throw new BadRequestException(UserErrors.mustBeArtist().message);
    }

    user.roles.push(role);
    user.updatedAt = new Date();
    return user.save();
  }

  async save(user: User): Promise<User> {
    return user.save();
  }

  async deleteById(userId: number): Promise<User | null> {
    return this.userModel.findOneAndDelete({ id: userId }).exec();
  }

}
