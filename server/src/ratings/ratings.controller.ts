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
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get(':targetType/:targetId')
  async findAllByTarget(
    @Param('targetType') targetType: 'artist' | 'album',
    @Param('targetId') targetId: string,
  ) {
    this.validateTargetType(targetType);
    return this.ratingsService.findAllByTarget(targetType, targetId);
  }

  @Get(':targetType/:targetId/summary')
  async getSummary(
    @Param('targetType') targetType: 'artist' | 'album',
    @Param('targetId') targetId: string,
  ) {
    this.validateTargetType(targetType);
    return this.ratingsService.getSummary(targetType, targetId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRatingDto, @Req() req) {
    const userId: number = req.user.id;
    const username: string = req.user.username;
    this.validateTargetType(dto.target_type);
    return this.ratingsService.create(dto, userId, username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('score') score: number,
    @Req() req,
  ) {
    return this.ratingsService.update(id, score, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.ratingsService.remove(id, req.user.id);
  }

  private validateTargetType(type: string) {
    const allowed = ['artist', 'album'];
    if (!allowed.includes(type)) {
      throw new BadRequestException(
        `Invalid target_type. Must be one of: ${allowed.join(', ')}`,
      );
    }
  }
}
