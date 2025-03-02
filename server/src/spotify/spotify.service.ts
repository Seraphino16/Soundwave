import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SpotifyService {
  private readonly spotifyApiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.spotifyApiUrl = <string>this.configService.get<string>('SPOTIFY_API_URL');
    this.clientId = <string>this.configService.get<string>('SPOTIFY_CLIENT_ID');
    this.clientSecret = <string>this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
  }

  // Récupérer un token d'accès Spotify
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

  // Récupérer les nouvelles sorties d'albums
  async getNewReleases(limit: number, offset: number) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(`${this.spotifyApiUrl}/browse/new-releases`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { limit, offset },
      });

      // Filtrer pour ne garder que le titre et l'image de couverture
      const albums = response.data.albums.items.map((album) => ({
        title: album.name,
        coverImage: album.images.length > 0 ? album.images[0].url : null,
      }));

      return { total: response.data.albums.total, albums };
    } catch (error) {
      console.error('Erreur lors de la récupération des albums:', error);
      throw new Error('Impossible de récupérer les albums');
    }
  }
}