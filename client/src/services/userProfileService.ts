import { API_URL } from '../config/api';
import { FeedWave } from './feedWavesService';

export interface Review {
    _id: string;
    target_type: 'album' | 'artist';
    target_id: string;
    message: string;
    rating?: number;
    createdAt: string;
    likes?: number;
    username?: string;
    profile_picture?: string;
    targetData?: {
        name: string;
        artistName?: string;
        cover?: string | null;
    };
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

export const userProfileService = {
    getUserProfile: async (_userId?: number): Promise<UserProfile> => {
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du profil utilisateur');
        }

        return await response.json();
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

    // ✅ Méthode mise à jour : appel réel à l’API pour récupérer les reviews de l’utilisateur connecté
    getUserReviews: async (): Promise<Review[]> => {
        try {
            const response = await fetch(`${API_URL}/reviews/me`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des reviews utilisateur');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API getUserReviews:', error);
            return [];
        }
    },

    updateUserProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du profil utilisateur');
        }

        return await response.json();
    },

    toggleFollow: async (userId: number): Promise<boolean> => {
        try {
            const response = await fetch(`${API_URL}/users/${userId}/toggle-follow`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Erreur lors du suivi/désabonnement');
            }

            return true;
        } catch (error) {
            console.error('Erreur API toggleFollow:', error);
            return false;
        }
    }
};
