/**
 * @description Gestion du contexte du profil utilisateur complet
 * @author SoundWave
 */

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";

interface UserProfile {
  _id: string;
  id: number;
  pseudo: string;
  username: string;
  birthdate: string;
  email: string;
  roles: string[];
  is_verified: boolean;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  verification_token: string;
  bio?: string;
  location?: string;
  musicPreferences?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    Deezer?: string;
    Facebook?: string;
  };
  profile_picture?: string;
  banner_picture?: string;
  followers?: number;
  following?: number;
  totalPlaylists?: number;
  totalEvents?: number;
  favoriteGenres?: string[];
  lastActive?: string;
  accountType?: 'free' | 'premium' | 'artist';
  spotifyId?: string;
  musicStyle?: string[];
}

interface UserProfileContextProps {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: (userId: number) => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5001/users/${userId}/profile`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Erreur lors de la récupération du profil:", errorData.message);
        setError(errorData.message || "Erreur lors de la récupération du profil");
        setUserProfile(null);
        return;
      }

      const profileData = await res.json();
      console.log("Profil utilisateur récupéré:", profileData);
      setUserProfile(profileData);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur:", error);
      setError("Erreur de connexion");
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!userProfile) return false;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5001/users/${userProfile.id}/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Erreur lors de la mise à jour du profil:", errorData.message);
        setError(errorData.message || "Erreur lors de la mise à jour du profil");
        return false;
      }

      const updatedProfile = await res.json();
      console.log("Profil mis à jour:", updatedProfile);
      setUserProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setError("Erreur de connexion");
      return false;
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const refreshProfile = useCallback(async () => {
    if (userProfile) {
      await fetchUserProfile(userProfile.id);
    }
  }, [userProfile, fetchUserProfile]);

  return (
    <UserProfileContext.Provider 
      value={{ 
        userProfile, 
        loading, 
        error, 
        fetchUserProfile, 
        updateUserProfile, 
        refreshProfile 
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfileContext = (): UserProfileContextProps => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfileContext must be used within a UserProfileProvider");
  }
  return context;
};
