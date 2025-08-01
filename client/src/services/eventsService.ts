// Interfaces for events service
export interface EventLocation {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
    venue: string;
}

export interface Artist {
    id: number;
    name: string;
    genre: string;
    image?: string;
}

export interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    endDate?: string;
    type: 'concert' | 'festival' | 'tour' | 'other';
    location: EventLocation;
    artists: Artist[];
    price?: {
        min: number;
        max: number;
        currency: string;
    };
    ticketUrl?: string;
    image?: string;
    capacity?: number;
    soldOut: boolean;
    tags: string[];
}

export interface EventFilters {
    artist?: string;
    radius?: number; // in kilometers
    location?: {
        latitude: number;
        longitude: number;
    };
    dateFrom?: string;
    dateTo?: string;
    type?: string;
}

export interface EventsResponse {
    events: Event[];
    total: number;
    hasMore: boolean;
}

// Mock data for development
const mockEvents: Event[] = [
    {
        id: 1,
        name: "Festival Zouk en Seine",
        description: "Le plus grand festival de zouk de France avec des zoukeurs internationaux.",
        date: "2025-08-15T20:00:00Z",
        endDate: "2025-08-18T23:59:00Z",
        type: "festival",
        location: {
            latitude: 48.8566,
            longitude: 2.3522,
            address: "123 Avenue des Champs-Élysées",
            city: "Paris",
            country: "France",
            venue: "Parc de Saint-Cloud"
        },
        artists: [
            { id: 1, name: "Zoukeurs Fous", genre: "Zouk" },
            { id: 2, name: "Big Zook", genre: "Encore Zouk" },
            { id: 3, name: "The Zooks", genre: "Toujours Zouk" }
        ],
        price: {
            min: 89,
            max: 299,
            currency: "EUR"
        },
        ticketUrl: "https://example.com/tickets/1",
        image: "/api/placeholder/400/300",
        capacity: 50000,
        soldOut: false,
        tags: ["zouk", "festival", "outdoor"]
    },
    {
        id: 2,
        name: "Concert Jazz au Sunset",
        description: "Soirée jazz intime avec des musiciens locaux et internationaux.",
        date: "2025-09-20T21:00:00Z",
        type: "concert",
        location: {
            latitude: 48.8606,
            longitude: 2.3376,
            address: "60 Rue des Lombards",
            city: "Paris",
            country: "France",
            venue: "Le Sunset/Sunside"
        },
        artists: [
            { id: 4, name: "Marcus Miller", genre: "Jazz" },
            { id: 5, name: "Esperanza Spalding", genre: "Jazz Fusion" }
        ],
        price: {
            min: 35,
            max: 65,
            currency: "EUR"
        },
        ticketUrl: "https://example.com/tickets/2",
        capacity: 200,
        soldOut: false,
        tags: ["jazz", "intimate", "indoor"]
    },
    {
        id: 3,
        name: "Électro Night Festival",
        description: "Festival de musique électronique avec les meilleurs DJs du moment.",
        date: "2025-09-05T22:00:00Z",
        endDate: "2025-09-06T06:00:00Z",
        type: "festival",
        location: {
            latitude: 43.6047,
            longitude: 1.4442,
            address: "Place du Capitole",
            city: "Toulouse",
            country: "France",
            venue: "Parc des Expositions"
        },
        artists: [
            { id: 6, name: "Séraphin Beoint", genre: "House" },
            { id: 7, name: "Aronchupa", genre: "Techno" },
            { id: 8, name: "DJ Callede", genre: "Techno" }
        ],
        price: {
            min: 45,
            max: 120,
            currency: "EUR"
        },
        ticketUrl: "https://example.com/tickets/3",
        capacity: 25000,
        soldOut: false,
        tags: ["electronic", "techno", "night", "outdoor"]
    },
    {
        id: 4,
        name: "Indie Folk Acoustique",
        description: "Concert acoustique dans un cadre intimiste.",
        date: "2025-08-02T19:30:00Z",
        type: "concert",
        location: {
            latitude: 45.7640,
            longitude: 4.8357,
            address: "1 Place des Terreaux",
            city: "Lyon",
            country: "France",
            venue: "Café de la Danse"
        },
        artists: [
            { id: 9, name: "Bon Iver", genre: "Indie Folk" },
            { id: 10, name: "Iron & Wine", genre: "Folk" }
        ],
        price: {
            min: 28,
            max: 45,
            currency: "EUR"
        },
        ticketUrl: "https://example.com/tickets/4",
        capacity: 150,
        soldOut: true,
        tags: ["folk", "acoustic", "intimate", "indoor"]
    },
    {
        id: 5,
        name: "Hip-Hop Summer Jam",
        description: "Festival hip-hop avec les stars du rap français et international.",
        date: "2025-08-12T18:00:00Z",
        endDate: "2025-08-12T23:59:00Z",
        type: "festival",
        location: {
            latitude: 43.2965,
            longitude: 5.3698,
            address: "Vieux-Port",
            city: "Marseille",
            country: "France",
            venue: "Stade Vélodrome"
        },
        artists: [
            { id: 11, name: "PNL", genre: "Rap" },
            { id: 12, name: "Kaaris", genre: "Hip-Hop" },
            { id: 13, name: "Kendrick Lamar", genre: "Hip-Hop" }
        ],
        price: {
            min: 55,
            max: 180,
            currency: "EUR"
        },
        ticketUrl: "https://example.com/tickets/5",
        capacity: 35000,
        soldOut: false,
        tags: ["hip-hop", "rap", "festival", "outdoor"]
    },
    {
        id: 6,
        name: "Classical Evening",
        description: "Soirée de musique classique avec l'orchestre symphonique.",
        date: "2025-08-25T20:00:00Z",
        type: "concert",
        location: {
            latitude: 47.2184,
            longitude: -1.5536,
            address: "Place Graslin",
            city: "Nantes",
            country: "France",
            venue: "Opéra de Nantes"
        },
        artists: [
            { id: 14, name: "Orchestre National", genre: "Classical" },
            { id: 15, name: "Archestre Notianol", genre: "Classical" }
        ],
        price: {
            min: 25,
            max: 95,
            currency: "EUR"
        },
        ticketUrl: "https://example.com/tickets/6",
        capacity: 800,
        soldOut: false,
        tags: ["classical", "orchestra", "formal", "indoor"]
    },
    {
        id: 7,
        name: "Reggaeton Epifest",
        description: "Festival de reggaeton par les étudiants d'Epitech.",
        date: "2025-08-25T20:00:00Z",
        type: "festival",
        location: {
            latitude: 50.636988971719155,
            longitude: 3.058393929105051,
            address: "101 Rue de l'Hôpital Militaire",
            city: "Lille",
            country: "France",
            venue: "Epitech Lille"
        },
        artists: [
            { id: 17, name: "Badman Simon", genre: "Reggaeton" },
            { id: 18, name: "Don Dada Fabienne", genre: "Gangsta Rap" },
            { id: 19, name: "Baldaswag", genre: "Reggaeton" }
        ],
        price: {
            min: 25,
            max: 95,
            currency: "EUR"
        },
        ticketUrl: "https://example.com/tickets/7",
        capacity: 800,
        soldOut: false,
        tags: ["reggaeton", "student", "festival", "outdoor"]
    }
];

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const eventsService = {
    // Get events with filters
    getEvents: async (filters: EventFilters = {}): Promise<EventsResponse> => {
        await delay(800); // Simulate API delay

        let filteredEvents = [...mockEvents];

        // Filter by artist name
        if (filters.artist && filters.artist.trim()) {
            const artistQuery = filters.artist.toLowerCase();
            filteredEvents = filteredEvents.filter(event =>
                event.artists.some(artist => 
                    artist.name.toLowerCase().includes(artistQuery)
                ) || event.name.toLowerCase().includes(artistQuery)
            );
        }

        // Filter by radius (if user location is provided)
        if (filters.radius && filters.location) {
            filteredEvents = filteredEvents.filter(event => {
                const distance = calculateDistance(
                    filters.location!.latitude,
                    filters.location!.longitude,
                    event.location.latitude,
                    event.location.longitude
                );
                return distance <= filters.radius!;
            });
        }

        // Filter by date range
        if (filters.dateFrom) {
            filteredEvents = filteredEvents.filter(event => 
                new Date(event.date) >= new Date(filters.dateFrom!)
            );
        }

        if (filters.dateTo) {
            filteredEvents = filteredEvents.filter(event => 
                new Date(event.date) <= new Date(filters.dateTo!)
            );
        }

        // Filter by event type
        if (filters.type && filters.type !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.type === filters.type);
        }

        // Sort by date (upcoming events first)
        filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
            events: filteredEvents,
            total: filteredEvents.length,
            hasMore: false // For pagination in the future
        };
    },

    // Get event by ID
    getEventById: async (id: number): Promise<Event | null> => {
        await delay(300);
        return mockEvents.find(event => event.id === id) || null;
    },

    // Get all unique artists for filter dropdown
    getArtists: async (): Promise<Artist[]> => {
        await delay(200);
        
        const allArtists = mockEvents.flatMap(event => event.artists);
        const uniqueArtists = allArtists.filter((artist, index, self) => 
            index === self.findIndex(a => a.id === artist.id)
        );
        
        return uniqueArtists.sort((a, b) => a.name.localeCompare(b.name));
    },

    // Get user's location (browser geolocation)
    getUserLocation: async (): Promise<{ latitude: number; longitude: number } | null> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                () => {
                    resolve(null); // User denied location or error occurred
                }
            );
        });
    }
};
