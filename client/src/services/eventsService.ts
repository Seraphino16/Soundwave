/**
 * @file eventsService.ts
 * @description Service de gestion des événements — inclut géolocalisation utilisateur et fallback sur Paris
 */

import { API_URL } from '../config/api';

export interface EventLocation {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
    venue: string;
}

export interface Artist {
    id: number | string;
    name: string;
    genre?: string;
    image?: string;
}

export interface Event {
    id: string | number;
    name: string;
    description: string;
    date: string;
    endDate: string;
    type: 'concert' | 'festival' | 'tour' | 'other';
    location: EventLocation;
    price?: {
        min: number;
        max: number;
        currency: string;
    };
    artists: Artist[];
    ticketUrl?: string;
    image?: string;
    capacity?: number;
    soldOut?: boolean;
    tags: string[];
}

export interface EventFilters {
    city?: string;
    artist?: string;
    radius?: number;
    location?: {
        latitude: number;
        longitude: number;
    };
    dateFrom?: string;
    dateTo?: string;
    type?: string;
}

export interface EventResponse {
    events: Event[];
    artists: Artist[];
    locations: string[];
    tags: string[];
    total: number;
    page: number;
    itemsPerPage: number;
    totalPages: number;
}

export const eventsService = {
    /**
     * 🔹 Récupère les événements selon les filtres
     */
    async getEvents(filters: Record<string, any> = {}, page = 1): Promise<EventResponse> {
        const params = new URLSearchParams();

        if (filters.city) params.append('city', filters.city);
        else if (!filters.artist && !filters.lat && !filters.lng) params.append('city', 'Lille');

        if (filters.artist) params.append('artist', filters.artist);
        if (filters.lat) params.append('lat', filters.lat.toString());
        if (filters.lng) params.append('lng', filters.lng.toString());
        if (page) params.append('page', page.toString());

        const url = `${API_URL}/events?${params.toString()}`;
        console.log('[EventsService] →', url);

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Erreur ${res.status} lors de la récupération des événements`);
        }

        const data = await res.json();

        const events: Event[] = Array.isArray(data.items) ? data.items : [];

        const artists: Artist[] = [
            ...new Map<string, Artist>(
                events
                    .flatMap((e: Event) => e.artists || [])
                    .map((artist: Artist) => [artist.name, artist])
            ).values(),
        ].sort((a: Artist, b: Artist) => a.name.localeCompare(b.name));

        const locations: string[] = [
            ...new Set(events.map((e: Event) => e.location?.city).filter(Boolean) as string[]),
        ];

        const tags: string[] = [
            ...new Set(events.flatMap((e: Event) => e.tags || []).filter(Boolean) as string[]),
        ];

        return {
            events,
            artists,
            locations,
            tags,
            total: data.total ?? events.length,
            page: data.page ?? 1,
            itemsPerPage: data.itemsPerPage ?? events.length,
            totalPages: data.totalPages ?? 1,
        };
    },


    /**
     * 🔹 Récupère les détails d’un événement par son ID
     */
    async getEventById(id: number): Promise<Event | null> {
        const response = await fetch(`${API_URL}/events/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!response.ok) {
            console.error(`Erreur ${response.status} lors de la récupération de l'événement ${id}`);
            return null;
        }

        return (await response.json()) as Event;
    },

    /**
     * 🔹 Tente d’obtenir la géolocalisation de l’utilisateur.
     * Retourne `null` si refusée ou impossible.
     */
    async getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn('La géolocalisation n’est pas supportée par ce navigateur.');
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn('Géolocalisation refusée ou échouée :', error.message);
                    resolve(null);
                },
                { enableHighAccuracy: true, timeout: 8000 }
            );
        });
    },

    /**
     * 🔹 Récupère la liste des artistes disponibles.
     */
    async getArtists(): Promise<Artist[]> {
        const response = await fetch(`${API_URL}/artists`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!response.ok) {
            console.warn(`Impossible de récupérer les artistes (${response.status})`);
            return [];
        }

        return (await response.json()) as Artist[];
    },
};
