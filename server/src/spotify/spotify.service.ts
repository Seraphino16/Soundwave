import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SpotifyService {
  private readonly spotifyApiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUriRegister: string;
  private readonly redirectUriLogin: string;

  constructor(private configService: ConfigService) {
    this.spotifyApiUrl = this.configService.get<string>('SPOTIFY_API_URL')!;
    this.clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID')!;
    this.clientSecret = this.configService.get<string>(
      'SPOTIFY_CLIENT_SECRET',
    )!;
    this.redirectUriRegister = this.configService.get<string>(
      'SPOTIFY_REDIRECT_URI_REGISTER',
    )!;
    this.redirectUriLogin = this.configService.get<string>(
      'SPOTIFY_REDIRECT_URI_LOGIN',
    )!;
  }

  generateSpotifyAuthUrl(isLogin: boolean = false): string {
    const redirectUri = isLogin
      ? this.redirectUriLogin
      : this.redirectUriRegister;

    return (
      `https://accounts.spotify.com/authorize?` +
      `client_id=${this.clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user-read-email%20user-read-private`
    );
  }

  async getAccessTokenFromCode(
    code: string,
    isLogin: boolean = false,
  ): Promise<string> {
    const redirectUri = isLogin
      ? this.redirectUriLogin
      : this.redirectUriRegister;

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      null,
      {
        params: {
          code,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        },
      },
    );

    return response.data.access_token;
  }

  async getSpotifyUserData(accessToken: string): Promise<any> {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  private async getAccessToken(): Promise<string> {
    const authResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
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
      let allAlbums: {
        id: string;
        title: string;
        coverImage: string | null;
      }[] = [];
      const limit = 50;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await axios.get(
          `${this.spotifyApiUrl}/browse/new-releases`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit, offset },
          },
        );

        const albums = response.data.albums.items.map((album: any) => ({
          id: album.id,
          title: album.name,
          coverImage: album.images.length > 0 ? album.images[0].url : null,
        }));

        allAlbums = [...allAlbums, ...albums];

        if (offset + limit >= response.data.albums.total) {
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

  // Récupère détails d'un album
  async getAlbumById(id: string) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(`${this.spotifyApiUrl}/albums/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const album = response.data;
      return {
        id: album.id,
        title: album.name,
        coverImage: album.images.length > 0 ? album.images[0].url : null,
        releaseDate: album.release_date,
        totalTracks: album.total_tracks,
        spotifyUrl: album.external_urls.spotify,
        label: album.label,
        popularity: album.popularity,
        artists: album.artists.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          spotifyUrl: artist.external_urls.spotify,
        })),
        tracks: album.tracks.items.map((track: any) => ({
          id: track.id,
          title: track.name,
          durationMs: track.duration_ms,
          spotifyUrl: track.external_urls.spotify,
          previewUrl: track.preview_url,
        })),
      };
    } catch (error) {
      console.error("Erreur lors de la récupération de l'album:", error);
      throw new Error("Impossible de récupérer l'album");
    }
  }

  // Récupérer tous les artistes récents
  async getAllNewArtists() {
    try {
      const accessToken = await this.getAccessToken();
      let allArtists: { id: string; name: string; image: string | null }[] = [];
      const limit = 50;
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const response = await axios.get(
          `${this.spotifyApiUrl}/browse/new-releases`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit, offset },
          },
        );

        const artists = response.data.albums.items
          .flatMap((album: any) =>
            album.artists.map((artist: any) => ({
              id: artist.id,
              name: artist.name,
              image: album.images.length > 0 ? album.images[0].url : null,
            })),
          )
          .filter(
            (artist, index, self) =>
              index === self.findIndex((a) => a.id === artist.id),
          );

        allArtists = [...allArtists, ...artists];

        if (offset + limit >= response.data.albums.total) {
          hasMore = false;
        } else {
          offset += limit;
        }
      }

      return { artists: allArtists };
    } catch (error) {
      console.error('Erreur lors de la récupération des artistes:', error);
      throw new Error('Impossible de récupérer les artistes');
    }
  }

  // Récupérer détails d'un artiste
  async getArtistById(id: string) {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.get(`${this.spotifyApiUrl}/artists/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const artist = response.data;
      return {
        id: artist.id,
        name: artist.name,
        image: artist.images.length > 0 ? artist.images[0].url : null,
        followers: artist.followers.total,
        genres: artist.genres,
        popularity: artist.popularity,
        spotifyUrl: artist.external_urls.spotify,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération de l'artiste:", error);
      throw new Error("Impossible de récupérer l'artiste");
    }
  }

  // Récupérer les albums d'un artisteA
  async getAlbumsByArtistId(artistId: string) {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get(
        `${this.spotifyApiUrl}/artists/${artistId}/albums`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            include_groups: 'album',
            market: 'FR',
            limit: 50,
          },
        }
      );

      const albums = response.data.items.map((album: any) => ({
        id: album.id,
        title: album.name,
        coverImage: album.images?.[0]?.url || null,
      }));

      return { albums };
    } catch (error) {
      console.error("Erreur lors de la récupération des albums de l'artiste:", error);
      throw new Error("Impossible de récupérer les albums de l'artiste");
    }
  }

  // Recherche par type
  private async searchSpotify(
    type: 'album' | 'artist',
    filters: Record<string, string>
  ): Promise<any> {
    const accessToken = await this.getAccessToken();
    const queryParts: string[] = [];

    // Construction du paramètre q selon le type
    if (type === 'album') {
      if (filters.name) queryParts.push(`album:${filters.name}`);
      if (filters.year) queryParts.push(`year:${filters.year}`);
    }

    if (type === 'artist') {
      if (filters.name) queryParts.push(filters.name); // Nom libre
      if (filters.genre) queryParts.push(`genre:"${filters.genre}"`);
    }

    const q = queryParts.join(' ').trim();

    const response = await axios.get(`${this.spotifyApiUrl}/search`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q, type, limit: 50 },
    });

    return response.data;
  }

  // Barre de filtres Albums
  async searchAlbums({ name, year }: { name?: string; year?: string }) {
    try {
      const filters: Record<string, string> = {};
      if (name) filters.name = name;
      if (year) filters.year = year;

      const data = await this.searchSpotify('album', filters);

      const albums = data.albums.items.map((album: any) => ({
        id: album.id,
        title: album.name,
        coverImage: album.images.length > 0 ? album.images[0].url : null,
      }));

      return { albums };
    } catch (error) {
      console.error('Erreur lors de la recherche d’albums:', error);
      throw new Error('Impossible de rechercher les albums');
    }
  }

  // Barre de filtres Artiste
  async searchArtists({ name, genre }: { name?: string; genre?: string }) {
    try {
      const filters: Record<string, string> = {};
      if (name) filters.name = name;
      if (genre) filters.genre = genre;

      const data = await this.searchSpotify('artist', filters);

      let artists = data.artists.items.map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url || null,
      }));

      if (name) {
        const lowerName = name.toLowerCase();
        artists = artists.filter((a) =>
          a.name.toLowerCase().includes(lowerName)
        );
      }

      return { artists };
    } catch (error) {
      console.error("Erreur lors de la recherche d'artistes:", error);
      throw new Error('Erreur lors de la recherche des artistes');
    }
  }
}
