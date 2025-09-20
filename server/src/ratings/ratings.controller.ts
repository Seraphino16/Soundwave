import { Controller, Get, Param, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get(':artistId')
  async findAllByArtist(@Param('artistId') artistId: string) {
    return this.ratingsService.findAllByArtist(artistId);
  }

  @Get(':artistId/summary')
  async getSummary(@Param('artistId') artistId: string) {
    return this.ratingsService.getSummary(artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRatingDto, @Req() req) {
    const userId: number = req.user.id;
    const username: string = req.user.username;
    return this.ratingsService.create(dto, userId, username);
  }
}
