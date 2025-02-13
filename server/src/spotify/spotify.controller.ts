import { Controller, Get } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('albums')
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('new-releases')
  async getNewReleases() {
    // Valeurs par défaut : limit = 10, offset = 0
    const limit = 10;
    const offset = 0;

    // Appeler le service pour récupérer les nouvelles sorties
    const data = await this.spotifyService.getNewReleases(limit, offset);
    return data; // Retourner les données au client
  }
}
