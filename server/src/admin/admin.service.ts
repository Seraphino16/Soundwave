import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  User,
  UserListResponse,
  UserResponse,
} from '../user/entities/user.entity';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getAllUsers(
    page: number,
    limit: number,
    sortBy: string,
    order: 'asc' | 'desc',
    filters: {
      search?: string;
      role?: string;
      isActive?: boolean;
      isVerified?: boolean;
    },
  ): Promise<UserListResponse> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<User> = {};

    if (filters.search) {
      query.$or = [
        { pseudo: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { username: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.role) {
      query.roles = filters.role;
    }

    if (filters.isActive !== undefined) {
      query.is_active = filters.isActive;
    }

    if (filters.isVerified !== undefined) {
      query.is_verified = filters.isVerified;
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = { [sortBy]: sortOrder };

    try {
      const [users, totalUsers] = await Promise.all([
        this.userModel
          .find(query)
          .select('-password -verification_token')
          .sort(sortOptions)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.userModel.countDocuments().exec(),
      ]);

      const totalPages = Math.ceil(totalUsers / limit);

      return {
        users: users as UserResponse[],
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des utilisateurs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    id: number,
    adminUpdateUserDto: AdminUpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.userModel
      .findOneAndUpdate({ id }, adminUpdateUserDto, {
        new: true,
        runValidators: true,
      })
      .lean<UserResponse>()
      .exec();

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }
}
