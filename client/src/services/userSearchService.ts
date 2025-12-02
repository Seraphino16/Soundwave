import { API_URL } from '../config/api';

export interface SearchUser {
    _id: string;
    id: number;
    pseudo: string;
    username: string;
    profile_picture?: string;
    bio?: string;
    is_verified: boolean;
    followers?: number;
}

export interface UserSearchResult {
    users: SearchUser[];
    total: number;
}

class UserSearchService {
    private baseUrl = API_URL;
    async searchUsers(query: string, limit: number = 10): Promise<UserSearchResult> {
        try {
            const response = await fetch(`${this.baseUrl}/users/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const adaptedData = data.map((user: any) => ({
                    _id: user.id.toString(),
                    id: user.id,
                    pseudo: user.pseudo,
                    username: user.username,
                    profile_picture: user.profile_picture,
                    is_verified: user.is_verified,
                    bio: '',
                    followers: 0 
                }));
                
                return {
                    users: adaptedData,
                    total: adaptedData.length
                };
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        } catch (error) {
            console.warn('API non disponible, utilisation des données mockées:', error);
            return this.getMockSearchResults(query, limit);
        }
    }
    private getMockSearchResults(query: string, limit: number): UserSearchResult {
        const mockUsers: SearchUser[] = [
            {
                _id: '11',
                id: 11,
                pseudo: 'stephe',
                username: 'stephe',
                profile_picture: `${process.env.REACT_APP_API_BASE_URL}/uploads/users/11/11_pfp.webp?v=1759241853990`,
                bio: 'salut c moi',
                is_verified: true,
                followers: 42
            }
        ];

        const filteredUsers = mockUsers.filter(user => 
            user.pseudo.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.bio?.toLowerCase().includes(query.toLowerCase())
        ).slice(0, limit);

        return {
            users: filteredUsers,
            total: filteredUsers.length
        };
    }
    async getPopularUsers(limit: number = 5): Promise<SearchUser[]> {
        try {
            const response = await fetch(`${this.baseUrl}/users/popular?limit=${limit}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data.map((user: any) => ({
                    _id: user.id.toString(),
                    id: user.id,
                    pseudo: user.pseudo,
                    username: user.username,
                    profile_picture: user.profile_picture,
                    is_verified: user.is_verified,
                    bio: '',
                    followers: 0
                }));
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        } catch (error) {
            console.warn('API non disponible, utilisation des données mockées:', error);
            return this.getMockPopularUsers(limit);
        }
    }
    private getMockPopularUsers(limit: number): SearchUser[] {
        const mockPopularUsers: SearchUser[] = [
            {
                _id: '11',
                id: 11,
                pseudo: 'stephe',
                username: 'stephe',
                profile_picture: `${process.env.REACT_APP_API_BASE_URL}/uploads/users/11/11_pfp.webp?v=1759241853990`,
                bio: 'salut c moi',
                is_verified: true,
                followers: 42
            }
        ];

        return mockPopularUsers.slice(0, limit);
    }
}

export const userSearchService = new UserSearchService();
