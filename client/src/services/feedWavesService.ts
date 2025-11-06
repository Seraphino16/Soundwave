/**
 * @description Service pour gérer les waves du feed principal
 * @author SoundWave
 */

import { API_URL } from '../config/api';

export interface WaveUser {
    id: number;
    pseudo: string;
    username: string;
    profile_picture?: string;
    is_verified: boolean;
}

export interface FeedWave {
    id: number;
    userId: number;
    content: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    visibility: boolean;
    createdAt: string;
    updatedAt: string;
    user: WaveUser;
}

export interface FeedReview {
    id: number;
    albumTitle: string;
    artist: string;
    albumCover: string;
    rating: number;
    content: string;
    likes: number;
    comments: number;
    createdAt: string;
    user: WaveUser;
}

class FeedWavesService {
    private baseUrl = API_URL;

    /**
     * @description Gets the waves from the main feed
     */
    async getFeedWaves(page: number = 1, limit: number = 10): Promise<{ waves: FeedWave[], total: number }> {
        const response = await fetch(`${this.baseUrl}/waves/feed?page=${page}&limit=${limit}`, {
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
    }

    /**
     * @description Gets the waves from a specific user
     */
    async getUserWaves(userId: number, page: number = 1, limit: number = 10): Promise<{ waves: FeedWave[], total: number }> {
        const response = await fetch(`${this.baseUrl}/waves/user/${userId}?page=${page}&limit=${limit}`, {
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
    }

    /**
     * @description Creates a new wave
     */
    async createWave(content: string): Promise<FeedWave> {
        const response = await fetch(`${this.baseUrl}/waves`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        return await response.json();
    }

    /**
     * @description Deletes a wave
     */
    async deleteWave(waveId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/waves/${waveId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }
    }

    /**
     * @description Likes/dislikes a wave
     */
    async toggleLike(waveId: number): Promise<boolean> {
        const response = await fetch(`${this.baseUrl}/waves/${waveId}/like`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.ok;
    }
}

export const feedWavesService = new FeedWavesService();

class ReviewsService {
    private baseUrl = 'http://localhost:5001';

    /**
     * @description Gets reviews for the main feed
     */
    async getFeedReviews(_page: number = 1, _limit: number = 10): Promise<{ reviews: FeedReview[], total: number }> {
        const mockReviews: FeedReview[] = [
            {
                id: 1,
                albumTitle: "Rumours",
                artist: "Fleetwood Mac",
                albumCover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                rating: 5,
                content: "Un chef-d'œuvre intemporel ! Chaque chanson raconte une histoire et l'alchimie du groupe transparaît dans chaque note. L'émotion brute de 'Go Your Own Way' et la mélancolie de 'Dreams' font de cet album une expérience inoubliable.",
                likes: 156,
                comments: 34,
                createdAt: "2024-07-28T09:15:00Z",
                user: {
                    id: 1,
                    pseudo: "Alex Martin",
                    username: "alexmusic",
                    profile_picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
                    is_verified: true
                }
            },
            {
                id: 2,
                albumTitle: "Blue Train",
                artist: "John Coltrane",
                albumCover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
                rating: 5,
                content: "L'excellence du saxophone de Coltrane atteint des sommets sur cet album. 'Blue Train' est un voyage musical fascinant qui démontre la maîtrise technique et l'émotion profonde de l'artiste. Un incontournable du jazz hard bop.",
                likes: 89,
                comments: 12,
                createdAt: "2024-07-27T18:30:00Z",
                user: {
                    id: 2,
                    pseudo: "Sarah Blues",
                    username: "sarahblues",
                    profile_picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
                    is_verified: false
                }
            }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 400));

        return {
            reviews: mockReviews,
            total: mockReviews.length
        };
    }

    /**
     * @description Like/dislike a review
     */
    async toggleLike(reviewId: number): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/reviews/${reviewId}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur lors du like/unlike de la review:', error);
            return false;
        }
    }
}

export const reviewsService = new ReviewsService();
