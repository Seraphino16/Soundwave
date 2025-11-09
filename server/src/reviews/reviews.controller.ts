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
  BadRequestException,
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
    this.validateTargetType(dto.target_type);

    const userId = req.user.id;
    const username = req.user.username;
    const profile_picture = req.user.profile_picture || 'https://via.placeholder.com/50';

    return this.reviewsService.create(dto, userId, username, profile_picture);
  }

  @Get(':targetType/:targetId')
  async findAllByTarget(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
  ) {
    this.validateTargetType(targetType);
    return this.reviewsService.findAllByTarget(targetType, targetId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':targetType/:targetId/me')
  async findUserReview(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
    @Req() req,
  ) {
    this.validateTargetType(targetType);
    return this.reviewsService.findUserReview(targetType, targetId, req.user.id);
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

  private validateTargetType(type: string) {
    const allowed = ['artist', 'album'];
    if (!allowed.includes(type)) {
      throw new BadRequestException(`Type de cible invalide. Utilisez "artist" ou "album".`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findAllMyReviews(@Req() req) {
    return this.reviewsService.findAllByUser(req.user.id);
  }

}
