/**
 * @description Service d'administration pour la gestion des utilisateurs (Frontend Mock)
 * @author SoundWave
 */

export interface User {
    id: number;
    pseudo: string;
    username: string;
    email: string;
    roles: string[];
    is_verified: boolean;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    birthdate?: string;
}

export interface UserListResponse {
    users: User[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalUsers: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    inactiveUsers: number;
    unverifiedUsers: number;
    recentRegistrations: number;
    usersByRole: {
        users: number;
        artists: number;
        admins: number;
        bands: number;
    };
}

// Mock data for development
const mockUsers: User[] = [
    {
        id: 1,
        pseudo: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        roles: ["USER"],
        is_verified: true,
        is_active: true,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        birthdate: "1990-05-15T00:00:00Z",
    },
    {
        id: 2,
        pseudo: "Jane Smith",
        username: "janesmith",
        email: "jane@example.com",
        roles: ["ARTIST"],
        is_verified: true,
        is_active: true,
        createdAt: "2024-02-20T14:20:00Z",
        updatedAt: "2024-02-20T14:20:00Z",
        birthdate: "1988-08-22T00:00:00Z",
    },
    {
        id: 3,
        pseudo: "Admin User",
        username: "admin",
        email: "admin@soundwave.com",
        roles: ["ADMIN"],
        is_verified: true,
        is_active: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
        birthdate: "1985-12-01T00:00:00Z",
    },
    {
        id: 4,
        pseudo: "Music Band",
        username: "musicband",
        email: "band@example.com",
        roles: ["BAND"],
        is_verified: true,
        is_active: false,
        createdAt: "2024-03-10T09:15:00Z",
        updatedAt: "2024-03-10T09:15:00Z",
        birthdate: "1992-11-03T00:00:00Z",
    },
    {
        id: 5,
        pseudo: "New Artist",
        username: "newartist",
        email: "newartist@example.com",
        roles: ["USER"],
        is_verified: false,
        is_active: true,
        createdAt: "2024-07-20T16:45:00Z",
        updatedAt: "2024-07-20T16:45:00Z",
        birthdate: "1995-03-28T00:00:00Z",
    },
    {
        id: 6,
        pseudo: "Rock Star",
        username: "rockstar",
        email: "rock@example.com",
        roles: ["ARTIST"],
        is_verified: true,
        is_active: true,
        createdAt: "2024-06-05T11:30:00Z",
        updatedAt: "2024-06-05T11:30:00Z",
        birthdate: "1987-07-14T00:00:00Z",
    },
    {
        id: 7,
        pseudo: "Test User",
        username: "testuser",
        email: "test@example.com",
        roles: ["USER"],
        is_verified: false,
        is_active: false,
        createdAt: "2024-07-25T08:00:00Z",
        updatedAt: "2024-07-25T08:00:00Z",
        birthdate: "1998-01-10T00:00:00Z",
    },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
    // Get all users with pagination and filters
    getAllUsers: async (
        page: number = 1,
        limit: number = 10,
        search?: string,
        role?: string,
        status?: string
    ): Promise<UserListResponse> => {
        await delay(500); // Simulate API delay

        let filteredUsers = [...mockUsers];

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
                user.username.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.pseudo.toLowerCase().includes(searchLower)
            );
        }

        // Apply role filter
        if (role && role !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.roles.includes(role));
        }

        // Apply status filter
        if (status && status !== 'all') {
            filteredUsers = filteredUsers.filter(user => 
                status === 'active' ? user.is_active : !user.is_active
            );
        }

        // Apply pagination
        const totalUsers = filteredUsers.length;
        const totalPages = Math.ceil(totalUsers / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        return {
            users: paginatedUsers,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    },

    // Get user details by ID
    getUserById: async (id: number) => {
        await delay(300);
        
        const user = mockUsers.find(u => u.id === id);
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        return {
            user,
            userInfos: {
                bio: "Passionné de musique depuis toujours",
                location: "Paris, France",
                musicStyle: ["Rock", "Pop"],
            },
        };
    },

    // Update user role
    updateUserRole: async (id: number, role: string) => {
        await delay(400);
        
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new Error("Utilisateur introuvable");
        }

        mockUsers[userIndex].roles = [role];
        mockUsers[userIndex].updatedAt = new Date().toISOString();

        return {
            message: 'Rôle utilisateur mis à jour avec succès',
            user: mockUsers[userIndex],
        };
    },

    // Toggle user active status
    toggleUserStatus: async (id: number) => {
        await delay(400);
        
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new Error("Utilisateur introuvable");
        }

        mockUsers[userIndex].is_active = !mockUsers[userIndex].is_active;
        mockUsers[userIndex].updatedAt = new Date().toISOString();

        return {
            message: `Utilisateur ${mockUsers[userIndex].is_active ? 'activé' : 'désactivé'} avec succès`,
            user: mockUsers[userIndex],
        };
    },

    // Delete user
    deleteUser: async (id: number) => {
        await delay(400);
        
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new Error("Utilisateur introuvable");
        }

        if (mockUsers[userIndex].roles.includes('ADMIN')) {
            throw new Error("Impossible de supprimer un administrateur");
        }

        mockUsers.splice(userIndex, 1);

        return {
            message: 'Utilisateur supprimé avec succès',
        };
    },

    // Get admin statistics
    getStats: async (): Promise<AdminStats> => {
        await delay(600);
        
        // Calculate real stats from mock data
        const totalUsers = mockUsers.length;
        const activeUsers = mockUsers.filter(u => u.is_active).length;
        const verifiedUsers = mockUsers.filter(u => u.is_verified).length;
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentRegistrations = mockUsers.filter(u => 
            new Date(u.createdAt) >= thirtyDaysAgo
        ).length;

        const usersByRole = {
            users: mockUsers.filter(u => u.roles.includes('USER')).length,
            artists: mockUsers.filter(u => u.roles.includes('ARTIST')).length,
            admins: mockUsers.filter(u => u.roles.includes('ADMIN')).length,
            bands: mockUsers.filter(u => u.roles.includes('BAND')).length,
        };

        return {
            totalUsers,
            activeUsers,
            verifiedUsers,
            inactiveUsers: totalUsers - activeUsers,
            unverifiedUsers: totalUsers - verifiedUsers,
            recentRegistrations,
            usersByRole,
        };
    },
};
