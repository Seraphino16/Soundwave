import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel('Review') private reviewModel: Model<Review>) {}

  async create(
    dto: CreateReviewDto,
    userId: number,
    username: string,
    profile_picture: string,
  ) {
    this.validateTargetType(dto.target_type);

    try {
      const review = new this.reviewModel({
        target_type: dto.target_type,
        target_id: dto.target_id,
        user_id: userId,
        username,
        profile_picture,
        message: dto.message,
      });

      return await review.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException(
          `Vous avez déjà publié une review pour ce ${dto.target_type === 'artist' ? 'artiste' : 'album'}`,
        );
      }
      throw err;
    }
  }

  async findAllByTarget(targetType: string, targetId: string) {
    this.validateTargetType(targetType);

    return this.reviewModel
      .find({ target_type: targetType, target_id: targetId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUserReview(targetType: string, targetId: string, userId: number) {
    this.validateTargetType(targetType);

    return this.reviewModel
      .findOne({
        target_type: targetType,
        target_id: targetId,
        user_id: userId,
      })
      .exec();
  }

  async update(id: string, message: string, userId: number) {
    const review = await this.reviewModel.findById(id).exec();

    if (!review) throw new NotFoundException('Review non trouvée');

    if (review.user_id !== userId) {
      throw new ConflictException('Vous ne pouvez modifier que vos propres reviews');
    }

    review.message = message;
    return review.save();
  }

  async remove(id: string, userId: number) {
    const review = await this.reviewModel.findById(id).exec();

    if (!review) throw new NotFoundException('Review non trouvée');

    if (review.user_id !== userId) {
      throw new ConflictException('Vous ne pouvez supprimer que vos propres reviews');
    }

    return review.deleteOne();
  }

  private validateTargetType(type: string) {
    const allowed = ['artist', 'album'];
    if (!allowed.includes(type)) {
      throw new BadRequestException(`Type de cible invalide : ${type}`);
    }
  }

  async findAllByUser(userId: number) {
    return this.reviewModel
      .find({ user_id: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

}
