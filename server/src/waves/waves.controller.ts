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
import { WavesService } from './waves.service';
import { CreateWaveDto } from './dto/create-wave.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

@Controller('waves')
export class WavesController {
  constructor(private readonly wavesService: WavesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateWaveDto, @Req() req) {
    const userId = req.user.id;
    const username = req.user.username;
    const profile_picture = req.user.profile_picture || 'https://via.placeholder.com/50';
    return this.wavesService.create(dto, userId, username, profile_picture);
  }

  @Get(':artistId')
  async findAllByArtist(@Param('artistId') artistId: string) {
    return this.wavesService.findAllByArtist(artistId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':artistId/me')
  async findUserWave(@Param('artistId') artistId: string, @Req() req) {
    const userId = req.user.id;
    return this.wavesService.findUserWave(artistId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('message') message: string,
    @Req() req,
  ) {
    return this.wavesService.update(id, message, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    return this.wavesService.remove(id, req.user.id);
  }
}
