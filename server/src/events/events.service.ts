import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GetEventsDto } from './dto/get-events.dto';
import {EventInterface, PaginatedResponse} from './interfaces/event.interface';
import { EventsErrors } from './errors/events.errors';

@Injectable()
export class EventsService {
    private readonly API_URL = 'https://api.setlist.fm/rest/1.0';
    private readonly API_KEY = process.env.SETLISTFM_API_KEY;

    constructor(private readonly httpService: HttpService) {}

    async getEvents(query: GetEventsDto): Promise<PaginatedResponse<EventInterface>> {
        if (!this.API_KEY) throw new Error(EventsErrors.MISSING_API_KEY);

        try {
            const params = new URLSearchParams();

            if (query.artist) params.append('artistName', query.artist);
            if (query.city) params.append('cityName', query.city);
            if (query.lat && query.lng) {
                params.append('lat', query.lat.toString());
                params.append('lng', query.lng.toString());
            }
            params.append('p', (query.page || 1).toString());

            const url = `${this.API_URL}/search/setlists?${params.toString()}`;

            console.log('🌍 Appel à Setlist.fm =>', url);

            const { data } = await firstValueFrom(
                this.httpService.get(url, {
                    headers: {
                        Accept: 'application/json',
                        'x-api-key': this.API_KEY,
                        'Accept-Language': 'fr',
                    },
                }),
            );

            const events: EventInterface[] = (data.setlist || []).map((item: any) => ({
                id: item.id,
                name: item.artist?.name || 'Concert',
                date: this.parseSetlistDate(item.eventDate),
                endDate: null,
                type: item.tour ? 'tour' : 'concert',
                description: item.info || '',
                location: {
                    venue: item.venue?.name || '',
                    city: item.venue?.city?.name || query.city || '',
                    country: item.venue?.city?.country?.name || '',
                    latitude: parseFloat(item.venue?.city?.coords?.lat || 0),
                    longitude: parseFloat(item.venue?.city?.coords?.long || 0),
                },
                artists: item.artist
                    ? [{ id: item.artist.mbid, name: item.artist.name }]
                    : [],
                tags: [item.tour?.name || 'Concert'],
                ticketUrl: item.url || null,
            }));

            const total = data.total ?? events.length;
            const page = data.page ?? 1;
            const itemsPerPage = data.itemsPerPage ?? events.length;
            const totalPages = Math.ceil(total / itemsPerPage);
            return {
                items: events,
                total,
                page,
                itemsPerPage,
                totalPages,
            };
        } catch (error: any) {
            console.error('❌ Erreur API Setlist.fm:', error.response?.data || error.message);
            throw new Error(EventsErrors.FAILED_TO_FETCH);
        }
    }



    async getEventDetails(id: string): Promise<{
        id: any;
        name: any;
        description: string;
        date: string | null;
        endDate: null;
        type: string;
        location: { latitude: number; longitude: number; address: any; city: any; country: any; venue: any };
        artists: { id: any; name: any; image: string }[];
        price: null;
        ticketUrl: string;
        image: null;
        capacity: undefined;
        soldOut: boolean;
        tags: any[]
    }> {
        if (!this.API_KEY) throw new Error(EventsErrors.MISSING_API_KEY);

        try {
            const { data } = await firstValueFrom(
                this.httpService.get(`${this.API_URL}/setlist/${id}`, {
                    headers: {
                        Accept: 'application/json',
                        'x-api-key': this.API_KEY,
                        'Accept-Language': 'fr',
                    },
                }),
            );

            return {
                id: data.id,
                name: data.artist?.name || 'Concert',
                description: data.info || '',
                date: this.parseSetlistDate(data.eventDate),
                endDate: null,
                type: data.tour ? 'tour' : 'concert',
                location: {
                    latitude: data.venue?.city?.coords?.lat
                        ? parseFloat(data.venue.city.coords.lat)
                        : 0,
                    longitude: data.venue?.city?.coords?.long
                        ? parseFloat(data.venue.city.coords.long)
                        : 0,
                    address: data.venue?.city?.state || '',
                    city: data.venue?.city?.name || '',
                    country: data.venue?.city?.country?.name || '',
                    venue: data.venue?.name || '',
                },
                artists: data.artist
                    ? [
                        {
                            id: data.artist.mbid || 0,
                            name: data.artist.name,
                            image: '',
                        },
                    ]
                    : [],
                price: null,
                ticketUrl: data.url || '',
                image: null,
                capacity: undefined,
                soldOut: false,
                tags: [data.tour?.name || 'Concert'],
            };
        } catch (error: any) {
            console.error('❌ Erreur API Setlist.fm (details):', error.response?.data || error.message);
            throw new Error(EventsErrors.FAILED_TO_FETCH);
        }
    }

    /** ✅ Convertit '13-11-2025' → ISO string */
    private parseSetlistDate(dateStr: string): string | null {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('-').map(Number);
        if (!day || !month || !year) return null;
        const date = new Date(year, month - 1, day);
        return isNaN(date.getTime()) ? null : date.toISOString();
    }
}
