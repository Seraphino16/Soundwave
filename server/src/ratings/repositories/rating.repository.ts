import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating } from '../entities/rating.entity';
import { CreateRatingDto } from '../dto/create-rating.dto';

@Injectable()
export class RatingRepository {
  constructor(@InjectModel('Rating') private readonly ratingModel: Model<Rating>) {}

  async setId(): Promise<number> {
    const last = await this.ratingModel.findOne().sort({ id: -1 }).exec();
    return last ? last.id + 1 : 1;
  }

  async create(dto: CreateRatingDto): Promise<Rating> {
    const id = await this.setId();
    return this.ratingModel.create({ ...dto, id, createdAt: new Date() });
  }

  async findByArtist(artistId: string): Promise<Rating[]> {
    return this.ratingModel.find({ artistId }).exec();
  }

  async findAverageByArtist(artistId: string): Promise<number> {
    const result = await this.ratingModel.aggregate([
      { $match: { artistId } },
      { $group: { _id: '$artistId', avg: { $avg: '$score' } } },
    ]);
    return result[0]?.avg || 0;
  }
}
