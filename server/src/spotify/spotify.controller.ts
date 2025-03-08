import { Controller, Get, Param } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller()
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('albums')
  async getAllNewReleases() {
    return await this.spotifyService.getAllNewReleases();
  }

  @Get('artists')
  async getAllNewArtists() {
    return await this.spotifyService.getAllNewArtists();
  }

  @Get('artist/:id')
  async getArtist(@Param('id') id: string) {
    return await this.spotifyService.getArtistById(id);
  }
}
