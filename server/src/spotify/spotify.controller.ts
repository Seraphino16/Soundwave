import { Controller, Get } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('albums')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get()
  async getAllNewReleases() {
    return await this.spotifyService.getAllNewReleases();
  }
}
