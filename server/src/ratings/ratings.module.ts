import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { RatingRepository } from './repositories/rating.repository';
import { RatingSchema } from './entities/rating.entity';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }]),
  TokenModule,
  ],
  controllers: [RatingsController],
  providers: [RatingsService, RatingRepository],
  exports: [RatingsService],
})
export class RatingsModule {}
