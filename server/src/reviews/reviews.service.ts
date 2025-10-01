import {
  Injectable,
  ConflictException,
  NotFoundException,
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
    try {
      const review = new this.reviewModel({
        artist_id: dto.artist_id,
        user_id: userId,
        username,
        profile_picture,
        message: dto.message,
      });
      return await review.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException(
          'Vous avez déjà publié une review pour cet artiste',
        );
      }
      throw err;
    }
  }

  async findAllByArtist(artistId: string) {
    return this.reviewModel
      .find({ artist_id: artistId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUserReview(artistId: string, userId: number) {
    return this.reviewModel
      .findOne({ artist_id: artistId, user_id: userId })
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
}
