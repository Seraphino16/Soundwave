/**
 * @description API configuration constants
 * @author SoundWave
 */

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL,
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
      EVENTS: {
          LIST: '/events',
          DETAILS: (id: number) => `/events/${id}`,
          ARTISTS: '/artists',
      },
  },
} as const;

export const API_URL = API_CONFIG.BASE_URL;
