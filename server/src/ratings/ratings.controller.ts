import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user-decorator';
import { JwtPayload } from 'jsonwebtoken';

@ApiTags('ratings')
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Ajouter une note à un artiste (authentifié)' })
  async addRating(
    @Body() dto: CreateRatingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ratingsService.addRating({
      ...dto,
      userId: user.id,
      username: user.username,
    });
  }

  @Get(':artistId')
  @ApiOperation({ summary: 'Récupérer toutes les notes pour un artiste' })
  async getRatings(@Param('artistId') artistId: string) {
    return this.ratingsService.getRatingsForArtist(artistId);
  }

  @Get(':artistId/summary')
  @ApiOperation({ summary: 'Récupérer résumé des notes (moyenne + total)' })
  async getSummary(@Param('artistId') artistId: string) {
    return this.ratingsService.getRatingsSummary(artistId);
  }
}
