import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from './rating.schema';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(@InjectModel('Rating') private ratingModel: Model<Rating>) {}

  async create(dto: CreateRatingDto, userId: number, username: string) {
    this.validateTargetType(dto.target_type);

    try {
      const rating = new this.ratingModel({
        target_type: dto.target_type,
        target_id: dto.target_id,
        user_id: userId,
        username,
        score: dto.score,
      });

      return await rating.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException(
          `Vous avez déjà noté ce ${dto.target_type === 'artist' ? 'artiste' : 'album'}`,
        );
      }
      throw err;
    }
  }

  async findAllByTarget(targetType: 'artist' | 'album', targetId: string) {
    this.validateTargetType(targetType);

    return this.ratingModel
      .find({ target_type: targetType, target_id: targetId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSummary(targetType: 'artist' | 'album', targetId: string) {
    this.validateTargetType(targetType);

    const result = await this.ratingModel.aggregate([
      { $match: { target_type: targetType, target_id: targetId } },
      {
        $group: {
          _id: null,
          average: { $avg: '$score' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (!result.length) {
      return { average: 0, count: 0 };
    }

    return { average: result[0].average, count: result[0].count };
  }

  async update(id: string, score: number, userId: number) {
    const rating = await this.ratingModel.findById(id).exec();

    if (!rating) {
      throw new NotFoundException('Note non trouvée');
    }
    if (rating.user_id !== userId) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre note');
    }

    rating.score = score;
    return rating.save();
  }

  async remove(id: string, userId: number) {
    const rating = await this.ratingModel.findById(id).exec();

    if (!rating) {
      throw new NotFoundException('Note non trouvée');
    }
    if (rating.user_id !== userId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que votre propre note');
    }

    return rating.deleteOne();
  }

  private validateTargetType(type: string) {
    const allowed = ['artist', 'album'];
    if (!allowed.includes(type)) {
      throw new BadRequestException(`Type de cible invalide. Doit être l'un de : ${allowed.join(', ')}`);
    }
  }
}
