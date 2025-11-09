import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { WavesService } from './waves.service';
import { CreateWaveDto } from './dto/create-wave.dto';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user-decorator';

@ApiTags('Waves')
@Controller('waves')
@UseGuards(JwtAuthGuard)
export class WavesController {
  constructor(private readonly wavesService: WavesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle wave' })
  @ApiOkResponse({ description: 'Wave créée avec succès' })
  @ApiBadRequestResponse({ description: 'Données invalides' })
  async create(
    @Body() createWaveDto: CreateWaveDto,
    @CurrentUser() user: any,
  ) {
    return await this.wavesService.create(user.id, createWaveDto);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Récupérer le feed de waves' })
  @ApiOkResponse({ description: 'Feed récupéré avec succès' })
  async getFeed(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (isNaN(pageNum) || pageNum < 1) {
      throw new BadRequestException('Le numéro de page doit être un nombre positif');
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      throw new BadRequestException('La limite doit être un nombre entre 1 et 50');
    }

    return await this.wavesService.getFeed(pageNum, limitNum);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Récupérer les waves d\'un utilisateur' })
  @ApiOkResponse({ description: 'Waves de l\'utilisateur récupérées avec succès' })
  async getUserWaves(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userIdNum = parseInt(userId, 10);
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (isNaN(userIdNum)) {
      throw new BadRequestException('ID utilisateur invalide');
    }

    return await this.wavesService.getUserWaves(userIdNum, pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une wave par son ID' })
  @ApiOkResponse({ description: 'Wave récupérée avec succès' })
  async findOne(@Param('id') id: string) {
    const waveId = parseInt(id, 10);
    
    if (isNaN(waveId)) {
      throw new BadRequestException('ID de wave invalide');
    }

    return await this.wavesService.findOne(waveId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une wave' })
  @ApiOkResponse({ description: 'Wave supprimée avec succès' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    const waveId = parseInt(id, 10);
    
    if (isNaN(waveId)) {
      throw new BadRequestException('ID de wave invalide');
    }

    await this.wavesService.remove(waveId, user.id);
    return { message: 'Wave supprimée avec succès' };
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Liker une wave' })
  @ApiOkResponse({ description: 'Wave likée avec succès' })
  async like(@Param('id') id: string) {
    const waveId = parseInt(id, 10);
    
    if (isNaN(waveId)) {
      throw new BadRequestException('ID de wave invalide');
    }

    return await this.wavesService.toggleLike(waveId, true);
  }

  @Delete(':id/like')
  @ApiOperation({ summary: 'Unliker une wave' })
  @ApiOkResponse({ description: 'Wave unlikée avec succès' })
  async unlike(@Param('id') id: string) {
    const waveId = parseInt(id, 10);
    
    if (isNaN(waveId)) {
      throw new BadRequestException('ID de wave invalide');
    }

    return await this.wavesService.toggleLike(waveId, false);
  }
}