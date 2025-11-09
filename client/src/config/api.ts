/**
 * @description API configuration constants
 * @author SoundWave
 */

export const API_CONFIG = {
  BASE_URL: 'http://localhost:5001',
  ENDPOINTS: {
    USERS: {
      ME: '/users/me',
      PROFILE: (userId: number) => `/users/${userId}/profile`,
      SEARCH: '/users/search',
      POPULAR: '/users/popular',
    },
    AUTH: {
      LOGIN: '/auth',
      LOGOUT: '/auth/logout',
      SPOTIFY: '/auth/spotify',
    },
    UPLOADS: {
      PROFILE_PICTURE: (userId: number) => `/uploads/profile-picture/${userId}`,
      BANNER_PICTURE: (userId: number) => `/uploads/banner-picture/${userId}`,
    },
  },
} as const;

export const API_URL = API_CONFIG.BASE_URL;
