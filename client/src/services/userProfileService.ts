import { API_URL } from '../config/api';
import { FeedWave } from './feedWavesService';

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

// Mock data for reviews
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
        totalWaves: 0,
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
    getUserProfile: async (_userId?: number): Promise<UserProfile> => {
        await delay(600);
        return mockUserProfile;
    },

    getUserWaves: async (userId: number, page = 1, limit = 10): Promise<{waves: FeedWave[], total: number}> => {
        try {
            const response = await fetch(`${API_URL}/waves/user/${userId}?page=${page}&limit=${limit}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des waves utilisateur:', error);
            return { waves: [], total: 0 };
        }
    },

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

    updateUserProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
        await delay(800);
        return { ...mockUserProfile, ...profileData };
    },

    toggleFollow: async (_userId: number): Promise<boolean> => {
        await delay(300);
        return true;
    }
};
