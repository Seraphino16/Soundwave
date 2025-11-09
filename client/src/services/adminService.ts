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

export interface DashboardStats {
    users: {
        total: number;
        active: number;
        newToday: number;
        newThisWeek: number;
        newThisMonth: number;
        growthRate: number;
    };
    content: {
        totalWaves: number;
        newWavesToday: number;
        wavesThisWeek: number;
        wavesThisMonth: number;
        albums: number;
        artists: number;
        totalPlaylists: number;
        collaborativePlaylists: number;
        sharedPlaylists: number;
    };
    interactions: {
        totalLikes: number;
        likesToday: number;
        totalComments: number;
        commentsToday: number;
        totalShares: number;
        sharesToday: number;
        engagementRate: number;
    };
    authentication: {
        native: number;
        google: number;
        spotify: number;
    };
    moderation: {
        reports: number;
        totalReports: number;
        resolvedReports: number;
        pendingReports: number;
        moderationActions: number;
        resolutionRate: number;
    };
    recentActivity: Array<{
        user: string;
        action: string;
        timestamp: string;
    }>;
    topAlbums: Array<{
        name: string;
        artist: string;
        plays: number;
    }>;
    topContent: {
        albums: Array<{ name: string; artist: string; views: number }>;
        artists: Array<{ name: string; followers: number; streams: number }>;
        genres: Array<{ name: string; popularity: number; streams: number }>;
        playlists: Array<{ name: string; creator: string; followers: number; isCollaborative: boolean }>;
    };
}

export interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor?: string;
        borderWidth?: number;
    }>;
}

export interface CreateUserData {
    username: string;
    email: string;
    pseudo: string;
    password: string;
    role: 'USER' | 'ARTIST' | 'BAND' | 'ADMIN';
    birthdate?: string;
}

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

const mockDashboardStats: DashboardStats = {
    users: {
        total: 403,
        active: 387,
        newToday: 12,
        newThisWeek: 89,
        newThisMonth: 283,
        growthRate: 15.7,
    },
    content: {
        totalWaves: 2847,
        newWavesToday: 142,
        wavesThisWeek: 956,
        wavesThisMonth: 2847,
        albums: 1234,
        artists: 456,
        totalPlaylists: 1234,
        collaborativePlaylists: 456,
        sharedPlaylists: 789,
    },
    interactions: {
        totalLikes: 12034,
        likesToday: 567,
        totalComments: 2345,
        commentsToday: 123,
        totalShares: 678,
        sharesToday: 34,
        engagementRate: 4.5,
    },
    authentication: {
        native: 267,
        google: 98,
        spotify: 38,
    },
    moderation: {
        reports: 23,
        totalReports: 23,
        resolvedReports: 19,
        pendingReports: 4,
        moderationActions: 12,
        resolutionRate: 82.6,
    },
    topContent: {
        albums: [
            { name: "Thriller", artist: "Michael Jackson", views: 15234 },
            { name: "Back in Black", artist: "AC/DC", views: 12456 },
            { name: "The Dark Side of the Moon", artist: "Pink Floyd", views: 11789 },
            { name: "Led Zeppelin IV", artist: "Led Zeppelin", views: 10923 },
            { name: "Abbey Road", artist: "The Beatles", views: 9876 },
        ],
        artists: [
            { name: "The Beatles", followers: 45234, streams: 156789 },
            { name: "Michael Jackson", followers: 38912, streams: 134567 },
            { name: "Queen", followers: 34567, streams: 123456 },
            { name: "Led Zeppelin", followers: 29876, streams: 112345 },
            { name: "Pink Floyd", followers: 27654, streams: 98765 },
        ],
        genres: [
            { name: "Rock", popularity: 78, streams: 245890 },
            { name: "Pop", popularity: 65, streams: 198765 },
            { name: "Hip-Hop", popularity: 58, streams: 167432 },
            { name: "Electronic", popularity: 42, streams: 123456 },
            { name: "Jazz", popularity: 35, streams: 89012 },
        ],
        playlists: [
            { name: "Hits 2024", creator: "SoundWave Team", followers: 25000, isCollaborative: false },
            { name: "Trucs aléatoires", creator: "MusicLover69", followers: 18500, isCollaborative: true },
            { name: "Jesaispas", creator: "Stéphane Vaillant", followers: 15200, isCollaborative: false },
            { name: "Chill Vibes", creator: "DJ ChillVibes", followers: 12800, isCollaborative: true },
            { name: "Gros rap", creator: "K2A", followers: 9600, isCollaborative: false },
        ],
    },
    recentActivity: [
        { user: "admin", action: "a approuvé un album", timestamp: "il y a 5 minutes" },
        { user: "moderator1", action: "a résolu un signalement", timestamp: "il y a 12 minutes" },
        { user: "user123", action: "s'est inscrit", timestamp: "il y a 15 minutes" },
        { user: "artist_pro", action: "a publié une wave", timestamp: "il y a 20 minutes" },
        { user: "admin", action: "a modifié les permissions", timestamp: "il y a 1 heure" },
    ],
    topAlbums: [
        { name: "Thriller", artist: "Michael Jackson", plays: 15234 },
        { name: "Back in Black", artist: "AC/DC", plays: 12456 },
        { name: "The Dark Side of the Moon", artist: "Pink Floyd", plays: 11789 },
        { name: "Led Zeppelin IV", artist: "Led Zeppelin", plays: 10923 },
        { name: "Abbey Road", artist: "The Beatles", plays: 9876 },
    ],
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
    getAllUsers: async (
        page: number = 1,
        limit: number = 10,
        search?: string,
        role?: string,
        status?: string
    ): Promise<UserListResponse> => {
        await delay(500);

        let filteredUsers = [...mockUsers];

        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(user => 
                user.username.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.pseudo.toLowerCase().includes(searchLower)
            );
        }

        if (role && role !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.roles.includes(role));
        }

        if (status && status !== 'all') {
            filteredUsers = filteredUsers.filter(user => 
                status === 'active' ? user.is_active : !user.is_active
            );
        }

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

    createUser: async (userData: CreateUserData) => {
        await delay(600);
        
        const existingUser = mockUsers.find(u => 
            u.username === userData.username || u.email === userData.email
        );
        
        if (existingUser) {
            throw new Error("Nom d'utilisateur ou email déjà utilisé");
        }
        
        const newUser: User = {
            id: Math.max(...mockUsers.map(u => u.id)) + 1,
            username: userData.username,
            email: userData.email,
            pseudo: userData.pseudo,
            roles: [userData.role],
            is_verified: false,
            is_active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...(userData.birthdate && { birthdate: userData.birthdate }),
        };
        
        mockUsers.unshift(newUser);
        
        return {
            message: 'Utilisateur créé avec succès',
            user: newUser,
        };
    },

    banUser: async (id: number) => {
        await delay(400);
        
        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new Error("Utilisateur introuvable");
        }

        if (mockUsers[userIndex].roles.includes('ADMIN')) {
            throw new Error("Impossible de bannir un administrateur");
        }

        const wasBanned = !mockUsers[userIndex].is_active;
        mockUsers[userIndex].is_active = wasBanned;
        mockUsers[userIndex].updatedAt = new Date().toISOString();

        return {
            message: `Utilisateur ${wasBanned ? 'débanni' : 'banni'} avec succès`,
            user: mockUsers[userIndex],
        };
    },

    getDashboardStats: async (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<DashboardStats> => {
        await delay(800);
        
        const multiplier = period === 'day' ? 0.1 : period === 'week' ? 0.7 : period === 'month' ? 1 : 12;
        
        const stats = { ...mockDashboardStats };
        
        stats.users.newToday = Math.floor(stats.users.newToday * multiplier);
        stats.users.newThisWeek = Math.floor(stats.users.newThisWeek * multiplier);
        stats.users.newThisMonth = Math.floor(stats.users.newThisMonth * multiplier);
        stats.content.newWavesToday = Math.floor(stats.content.newWavesToday * multiplier);
        stats.content.wavesThisWeek = Math.floor(stats.content.wavesThisWeek * multiplier);
        
        return stats;
    },

    getUserGrowthChart: async (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ChartData> => {
        await delay(1100);
        
        const generateTimeSeriesData = (period: string) => {
            const baseData = [
                { date: '2024-07-01', users: 120 },
                { date: '2024-07-02', users: 135 },
                { date: '2024-07-03', users: 142 },
                { date: '2024-07-04', users: 158 },
                { date: '2024-07-05', users: 167 },
                { date: '2024-07-06', users: 173 },
                { date: '2024-07-07', users: 189 },
                { date: '2024-07-08', users: 195 },
                { date: '2024-07-09', users: 208 },
                { date: '2024-07-10', users: 215 },
                { date: '2024-07-11', users: 223 },
                { date: '2024-07-12', users: 234 },
                { date: '2024-07-13', users: 247 },
                { date: '2024-07-14', users: 256 },
                { date: '2024-07-15', users: 268 },
                { date: '2024-07-16', users: 275 },
                { date: '2024-07-17', users: 289 },
                { date: '2024-07-18', users: 297 },
                { date: '2024-07-19', users: 308 },
                { date: '2024-07-20', users: 315 },
                { date: '2024-07-21', users: 327 },
                { date: '2024-07-22', users: 334 },
                { date: '2024-07-23', users: 346 },
                { date: '2024-07-24', users: 353 },
                { date: '2024-07-25', users: 365 },
                { date: '2024-07-26', users: 372 },
                { date: '2024-07-27', users: 384 },
                { date: '2024-07-28', users: 391 },
                { date: '2024-07-29', users: 403 },
            ];

            if (period === 'day') {
                return baseData.slice(-6);
            } else if (period === 'week') {
                return baseData.slice(-7);
            } else if (period === 'month') {
                return baseData;
            } else {
                return baseData.filter((_, index) => index % 3 === 0).slice(-12);
            }
        };

        const timeSeriesData = generateTimeSeriesData(period);
        
        return {
            labels: timeSeriesData.map(data => {
                const date = new Date(data.date);
                return period === 'day' ? 
                    date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) :
                    date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
            }),
            datasets: [
                {
                    label: 'New users',
                    data: timeSeriesData.map(data => data.users),
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                },
            ],
        };
    },

    getContentChart: async (period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ChartData> => {
        await delay(500);
        
        let labels: string[];
        let data: number[];
        let colors: string[];
        
        if (period === 'day') {
            const hours = ['06h', '09h', '12h', '15h', '18h', '21h'];
            labels = hours;
            data = hours.map(() => Math.floor(Math.random() * 15) + 5);
            colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
        } else if (period === 'week') {
            const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
            labels = weekDays;
            data = weekDays.map(() => Math.floor(Math.random() * 50) + 20);
            colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
        } else if (period === 'month') {
            const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
            labels = weeks;
            data = weeks.map(() => Math.floor(Math.random() * 200) + 100);
            colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
        } else {
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
            labels = months;
            data = months.map(() => Math.floor(Math.random() * 500) + 200);
            colors = [
                '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
                '#84CC16', '#F97316', '#EC4899', '#6366F1', '#14B8A6', '#F43F5E'
            ];
        }
        
        return {
            labels,
            datasets: [
                {
                    label: 'Contenu publié',
                    data,
                    backgroundColor: colors,
                    borderWidth: 1,
                },
            ],
        };
    },

    getAuthMethodsChart: async (): Promise<ChartData> => {
        await delay(400);
        
        const stats = mockDashboardStats.authentication;
        
        return {
            labels: ['Native', 'Google', 'Spotify'],
            datasets: [
                {
                    label: 'Connection methods',
                    data: [stats.native, stats.google, stats.spotify],
                    backgroundColor: [
                        '#3B82F6',
                        '#EF4444',
                        '#10B981',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    },
};
