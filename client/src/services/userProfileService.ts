// Service for user profile data and operations
export interface Wave {
    id: number;
    title: string;
    description: string;
    artist: string;
    album: string;
    genre: string;
    rating: number;
    createdAt: string;
    imageUrl?: string;
    songUrl?: string;
    tags: string[];
    likes: number;
    comments: number;
}

export interface Review {
    id: number;
    albumId: number;
    albumTitle: string;
    albumCover: string;
    artist: string;
    rating: number;
    content: string;
    createdAt: string;
    likes: number;
}

export interface UserProfileStats {
    totalWaves: number;
    totalReviews: number;
    totalLikes: number;
    totalFollowers: number;
    totalFollowing: number;
    averageRating: number;
    joinedDate: string;
}

export interface UserProfile {
    id: number;
    username: string;
    pseudo: string;
    email: string;
    bio?: string;
    location?: string;
    website?: string;
    profileImage?: string;
    bannerImage?: string;
    isVerified: boolean;
    stats: UserProfileStats;
}

// Mock data for demonstration
const mockWaves: Wave[] = [
    {
        id: 1,
        title: "Découverte de la semaine",
        description: "Cette chanson m'a complètement transporté ! Les arrangements sont incroyables et la voix si émouvante. Un vrai coup de cœur musical.",
        artist: "Bon Iver",
        album: "For Emma, Forever Ago",
        genre: "Indie Folk",
        rating: 5,
        createdAt: "2024-07-28T10:30:00Z",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b27389d2970ad135571a0243ca31",
        tags: ["indie", "folk", "emotional", "acoustic"],
        likes: 24,
        comments: 8
    },
    {
        id: 2,
        title: "Nostalgie des années 80",
        description: "Retour en enfance avec ce titre culte. La production est parfaite et ça me rappelle les soirées d'été.",
        artist: "The Weeknd",
        album: "After Hours",
        genre: "Pop/R&B",
        rating: 4,
        createdAt: "2024-07-25T15:45:00Z",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273ef6ac8b01d24ce36f92b7883",
        tags: ["80s", "synthwave", "nostalgia"],
        likes: 18,
        comments: 5
    },
    {
        id: 3,
        title: "Energy du matin",
        description: "Perfect pour commencer la journée ! Ce beat me donne envie de bouger et la mélodie reste en tête toute la journée.",
        artist: "Daft Punk",
        album: "Random Access Memories",
        genre: "Electronic",
        rating: 5,
        createdAt: "2024-07-22T08:15:00Z",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273de3c04b5a7e5b44d8520c868",
        tags: ["electronic", "dance", "energy", "morning"],
        likes: 31,
        comments: 12
    },
    {
        id: 4,
        title: "Jazz session nocturne",
        description: "Ambiance feutrée pour une soirée tranquille. Les improvisations sont magistrales et l'atmosphère parfaite.",
        artist: "Miles Davis",
        album: "Kind of Blue",
        genre: "Jazz",
        rating: 5,
        createdAt: "2024-07-20T22:00:00Z",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273e4e12e4b3c2c2948492b0273",
        tags: ["jazz", "night", "chill", "classic"],
        likes: 15,
        comments: 4
    }
];

const mockReviews: Review[] = [
    {
        id: 1,
        albumId: 1,
        albumTitle: "DAMN.",
        albumCover: "https://i.scdn.co/image/ab67616d0000b273b23e9c135f2a120e200e7ac1",
        artist: "Kendrick Lamar",
        rating: 5,
        content: "Un album magistral qui explore des thèmes profonds avec une production impeccable. Chaque track raconte une histoire et l'ensemble forme un récit cohérent sur la condition humaine.",
        createdAt: "2024-07-26T14:20:00Z",
        likes: 42
    },
    {
        id: 2,
        albumId: 2,
        albumTitle: "Blonde",
        albumCover: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
        artist: "Frank Ocean",
        rating: 4,
        content: "Une œuvre d'art émotionnelle qui repousse les limites du R&B contemporain. Les arrangements sont subtils et la voix de Frank Ocean transcende chaque morceau.",
        createdAt: "2024-07-24T11:15:00Z",
        likes: 38
    },
    {
        id: 3,
        albumId: 3,
        albumTitle: "OK Computer",
        albumCover: "https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856",
        artist: "Radiohead",
        rating: 5,
        content: "Visionnaire et intemporel. Cet album a défini une génération et continue d'influencer la musique aujourd'hui. Une masterpiece absolue.",
        createdAt: "2024-07-21T16:45:00Z",
        likes: 56
    }
];

const mockUserProfile: UserProfile = {
    id: 1,
    username: "music_lover_2024",
    pseudo: "Alex Martin",
    email: "alex.martin@example.com",
    bio: "Passionné de musique depuis toujours 🎵 | Découvreur de talents | Amateur de vinyles vintage | Toujours à la recherche du prochain chef-d'œuvre musical ✨",
    location: "Paris, France",
    website: "https://alexmusic.blog",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
    bannerImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop",
    isVerified: true,
    stats: {
        totalWaves: mockWaves.length,
        totalReviews: mockReviews.length,
        totalLikes: 156,
        totalFollowers: 1247,
        totalFollowing: 89,
        averageRating: 4.7,
        joinedDate: "2023-03-15T10:00:00Z"
    }
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userProfileService = {
    // Get user profile by ID (or current user if no ID provided)
    getUserProfile: async (_userId?: number): Promise<UserProfile> => {
        await delay(600);
        return mockUserProfile;
    },

    // Get user's waves
    getUserWaves: async (_userId?: number, page = 1, limit = 10): Promise<{waves: Wave[], total: number}> => {
        await delay(400);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedWaves = mockWaves.slice(startIndex, endIndex);
        
        return {
            waves: paginatedWaves,
            total: mockWaves.length
        };
    },

    // Get user's reviews
    getUserReviews: async (_userId?: number, page = 1, limit = 5): Promise<{reviews: Review[], total: number}> => {
        await delay(350);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedReviews = mockReviews.slice(startIndex, endIndex);
        
        return {
            reviews: paginatedReviews,
            total: mockReviews.length
        };
    },

    // Update user profile
    updateUserProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
        await delay(800);
        return { ...mockUserProfile, ...profileData };
    },

    // Follow/unfollow user
    toggleFollow: async (_userId: number): Promise<boolean> => {
        await delay(300);
        return true; // Returns new follow status
    }
};
