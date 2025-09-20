import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from './rating.schema';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(@InjectModel('Rating') private ratingModel: Model<Rating>) {}

  async create(dto: CreateRatingDto, userId: number, username: string) {
    try {
      const rating = new this.ratingModel({
        artist_id: dto.artist_id,
        user_id: userId,
        username,
        score: dto.score,
      });

      return await rating.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException('Vous avez déjà noté cet artiste');
      }
      throw err;
    }
  }

  async findAllByArtist(artistId: string) {
    return this.ratingModel
      .find({ artist_id: artistId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getSummary(artistId: string) {
    const result = await this.ratingModel.aggregate([
      { $match: { artist_id: artistId } },
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
}
