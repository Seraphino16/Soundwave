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
    title: string;
    description: string;
    artist: string;
    album: string;
    genre: string;
    rating: number;
    imageUrl?: string;
    tags: string[];
    likes: number;
    comments: number;
    createdAt: string;
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
     * Récupérer les waves du feed principal
     */
    async getFeedWaves(page: number = 1, limit: number = 10): Promise<{ waves: FeedWave[], total: number }> {
        try {
            // Essayer d'utiliser la vraie API
            const response = await fetch(`${this.baseUrl}/waves/feed?page=${page}&limit=${limit}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        } catch (error) {
            console.warn('API des waves non disponible, utilisation des données mockées:', error);
            return this.getMockWaves();
        }
    }

    /**
     * Données mockées pour tester la fonctionnalité
     */
    private getMockWaves(): { waves: FeedWave[], total: number } {
        const mockWaves: FeedWave[] = [
            {
                id: 1,
                title: "Ma découverte drill du moment",
                description: "Gros son qui frappe fort ! Cette track me met dans l'ambiance pour toute la journée. Le flow est incroyable.",
                artist: "Central Cee",
                album: "Wild West",
                genre: "Drill",
                rating: 5,
                imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                tags: ["drill", "gros son", "ouais"],
                likes: 42,
                comments: 8,
                createdAt: "2025-09-30T10:30:00Z",
                user: {
                    id: 11,
                    pseudo: "stephe",
                    username: "stephe",
                    profile_picture: "http://localhost:5001/uploads/users/11/11_pfp.webp?v=1759241853990",
                    is_verified: true
                }
            }
        ];

        return {
            waves: mockWaves,
            total: mockWaves.length
        };
    }

    /**
     * Liker/Unliker une wave
     */
    async toggleLike(waveId: number): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/waves/${waveId}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur lors du like/unlike de la wave:', error);
            return false;
        }
    }

    /**
     * Ajouter un commentaire à une wave
     */
    async addComment(waveId: number, content: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/waves/${waveId}/comments`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
            return false;
        }
    }
}

export const feedWavesService = new FeedWavesService();

class ReviewsService {
    private baseUrl = 'http://localhost:5001';

    /**
     * Récupérer les reviews du feed principal
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
     * Liker/Unliker une review
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
