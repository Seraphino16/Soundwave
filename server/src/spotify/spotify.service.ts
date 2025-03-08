import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SpotifyService {
  private readonly spotifyApiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.spotifyApiUrl = this.configService.get<string>('SPOTIFY_API_URL')!;
    this.clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID')!;
    this.clientSecret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET')!;
  }

  private async getAccessToken(): Promise<string> {
    const authResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({ grant_type: 'client_credentials' }),
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
    );

    return authResponse.data.access_token;
  }

  // Récupérer tous les albums récents
  async getAllNewReleases() {
    try {
      const accessToken = await this.getAccessToken();
      let allAlbums: { title: string; coverImage: string | null }[] = [];
      let limit = 50;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await axios.get(`${this.spotifyApiUrl}/browse/new-releases`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { limit, offset },
        });

        const albums = response.data.albums.items.map((album: any) => ({
          title: album.name,
          coverImage: album.images.length > 0 ? album.images[0].url : null,
        }));

        allAlbums = [...allAlbums, ...albums];

        const totalAlbumsFromSpotify = response.data.albums.total;

        if (offset + limit >= totalAlbumsFromSpotify) {
          hasMore = false;
        } else {
          offset += limit;
        }
      }

      return { albums: allAlbums };
    } catch (error) {
      console.error('Erreur lors de la récupération des albums:', error);
      throw new Error('Impossible de récupérer les albums');
    }
  }

  // Récupérer tous les artistes récents
  async getAllNewArtists() {
    try {
      const accessToken = await this.getAccessToken();
      let allArtists: { id: string; name: string; image: string | null }[] = [];
      let limit = 50;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await axios.get(`${this.spotifyApiUrl}/browse/new-releases`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { limit, offset },
        });

        const artists = response.data.albums.items
            .flatMap((album: any) => album.artists.map((artist: any) => ({
              id: artist.id,
              name: artist.name,
              image: album.images.length > 0 ? album.images[0].url : null,
            })))
            .filter((artist, index, self) =>
                index === self.findIndex((a) => a.id === artist.id)
            );

        allArtists = [...allArtists, ...artists];

        const totalAlbumsFromSpotify = response.data.albums.total;

        if (offset + limit >= totalAlbumsFromSpotify) {
          hasMore = false;
        } else {
          offset += limit;
        }
      }

      const albumsData = await this.getAllNewReleases();
      allArtists = allArtists.slice(0, albumsData.albums.length);

      return { artists: allArtists };
    } catch (error) {
      console.error('Erreur lors de la récupération des artistes:', error);
      throw new Error('Impossible de récupérer les artistes');
    }
  }
}