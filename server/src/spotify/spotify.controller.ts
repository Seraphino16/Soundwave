import { Controller, Get } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('albums')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get()
  async getNewReleases() {
    return this.spotifyService.getNewReleases(12, 0);
  }
}
