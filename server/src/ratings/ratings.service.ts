import { Injectable } from '@nestjs/common';
import { RatingRepository } from './repositories/rating.repository';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingsService {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async addRating(dto: CreateRatingDto): Promise<Rating> {
    return this.ratingRepository.create(dto);
  }

  async getRatingsForArtist(artistId: string): Promise<Rating[]> {
    return this.ratingRepository.findByArtist(artistId);
  }

  async getRatingsSummary(artistId: string): Promise<{ average: number; count: number }> {
    const ratings = await this.ratingRepository.findByArtist(artistId);
    if (!ratings.length) {
      return { average: 0, count: 0 };
    }
    const sum = ratings.reduce((acc, r) => acc + r.score, 0);
    const average = Math.round((sum / ratings.length) * 10) / 10;
    return { average, count: ratings.length };
  }
}
