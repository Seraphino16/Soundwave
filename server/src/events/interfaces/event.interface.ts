export interface EventInterface {
    id: string;
    name: string;
    date: string;
    endDate?: string | null;
    type: 'concert' | 'tour' | 'festival' | 'event';
    description?: string;
    location: {
        venue: string;
        city: string;
        country: string;
        latitude: number;
        longitude: number;
    };
    artists: {
        id?: string;
        name: string;
    }[];
    tags: string[];
    soldOut?: boolean;
    image?: string | null;
    price?: { min: number; max: number } | null;
    ticketUrl?: string | null;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    itemsPerPage: number;
    totalPages: number;
}

