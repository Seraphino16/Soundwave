import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SpotifyService {
  private readonly spotifyApiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    // Récupérer les informations à partir des variables d'environnement
    this.spotifyApiUrl = <string>(
      this.configService.get<string>('SPOTIFY_API_URL')
    );
    this.clientId = <string>this.configService.get<string>('SPOTIFY_CLIENT_ID');
    this.clientSecret = <string>(
      this.configService.get<string>('SPOTIFY_CLIENT_SECRET')
    );
  }

  // Méthode pour récupérer les albums
  async getNewReleases(limit: number, offset: number) {
    try {
      // Récupérer un token d'accès avec le client ID et le secret
      const authResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const accessToken = authResponse.data.access_token;

      // Appeler l'API des nouvelles sorties avec le token d'accès
      const response = await axios.get(
        `${this.spotifyApiUrl}/browse/new-releases`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: limit,
            offset: offset,
          },
        },
      );

      return response.data; // Retourner les données de la réponse API
    } catch (error) {
      console.error('Erreur lors de la récupération des albums:', error);
      throw new Error('Erreur lors de la récupération des albums');
    }
  }
}
