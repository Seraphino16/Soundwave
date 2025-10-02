import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateReviewDto, @Req() req) {
    const userId = req.user.id;
    const username = req.user.username;
    const profile_picture = req.user.profile_picture || 'https://via.placeholder.com/50';
    return this.reviewsService.create(dto, userId, username, profile_picture);
  }

  @Get(':artistId')
  async findAllByArtist(@Param('artistId') artistId: string) {
    return this.reviewsService.findAllByArtist(artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':artistId/me')
  async findUserReview(@Param('artistId') artistId: string, @Req() req) {
    const userId = req.user.id;
    return this.reviewsService.findUserReview(artistId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('message') message: string,
    @Req() req,
  ) {
    return this.reviewsService.update(id, message, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.reviewsService.remove(id, req.user.id);
  }
}
