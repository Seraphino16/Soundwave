import { Controller, Get, Param, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller()
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('albums')
  async getAllNewReleases() {
    return await this.spotifyService.getAllNewReleases();
  }

  @Get('album/:id')
  async getAlbum(@Param('id') id: string) {
    return await this.spotifyService.getAlbumById(id);
  }

  @Get('artists')
  async getAllNewArtists() {
    return await this.spotifyService.getAllNewArtists();
  }

  @Get('artist/:id')
  async getArtist(@Param('id') id: string) {
    return await this.spotifyService.getArtistById(id);
  }

  @Get('artist/:id/albums')
  async getAlbumsByArtist(@Param('id') id: string) {
    return await this.spotifyService.getAlbumsByArtistId(id);
  }

  @Get('artist/:id/albums-with-tracks')
  async getAlbumsWithTracks(@Param('id') id: string) {
    return await this.spotifyService.getAlbumsWithTracksByArtistId(id);
  }

  @Get('albums/search')
  async searchAlbums(
    @Query('name') name?: string,
    @Query('year') year?: string,
  ) {
    return await this.spotifyService.searchAlbums({ name, year });
  }

  @Get('artists/search')
  searchArtists(@Query('name') name?: string, @Query('genre') genre?: string) {
    return this.spotifyService.searchArtists({ name, genre });
  }
}
