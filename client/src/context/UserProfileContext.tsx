/**
 * @description Gestion du contexte du profil utilisateur complet
 * @author SoundWave
 */

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { API_CONFIG } from "../config/api";

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
  musicStyle?: string[];
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
}

interface UserProfileContextProps {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchUserProfile: (userId: number) => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  uploadProfilePicture: (file: File) => Promise<boolean>;
  uploadBannerPicture: (file: File) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  previewImages: { profile?: string; banner?: string };
  hasUnsavedChanges: boolean;
  resetPreview: () => void;
}

const UserProfileContext = createContext<UserProfileContextProps | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<{ profile?: string; banner?: string }>({});
  const [pendingFiles, setPendingFiles] = useState<{ profile?: File; banner?: File }>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const fetchUserProfile = useCallback(async (userId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS.PROFILE(userId)}`;
      
      const res = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        let errorMessage = "Erreur lors de la récupération du profil";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          if (res.status === 404) {
            errorMessage = "Profil introuvable";
          }
        }
        setError(errorMessage);
        setUserProfile(null);
        return;
      }

      const profileData = await res.json();
      setUserProfile(profileData);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur:", error);
      setError("Erreur de connexion - Le serveur backend est-il démarré ?");
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
      const dataToSend: Partial<UserProfile> = { ...profileData };

      if (pendingFiles.profile) {
        const fd = new FormData();
        fd.append('file', pendingFiles.profile);
        const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOADS.PROFILE_PICTURE(userProfile.id)}`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || "Erreur lors de l'upload de la photo de profil");
          return false;
        }
        const result = await res.json();
        if (result?.url) {
          dataToSend.profile_picture = result.url;
        }
      }

      if (pendingFiles.banner) {
        const fd = new FormData();
        fd.append('file', pendingFiles.banner);
        const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOADS.BANNER_PICTURE(userProfile.id)}`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        });
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || "Erreur lors de l'upload de la bannière");
          return false;
        }
        const result = await res.json();
        if (result?.url) {
          dataToSend.banner_picture = result.url;
        }
      }

      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS.PROFILE(userProfile.id)}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Erreur lors de la mise à jour du profil");
        return false;
      }

      const updatedProfile = await res.json();
      setUserProfile(updatedProfile);
      if (previewImages.profile) URL.revokeObjectURL(previewImages.profile);
      if (previewImages.banner) URL.revokeObjectURL(previewImages.banner);
      setPreviewImages({});
      setPendingFiles({});
      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setError("Erreur de connexion");
      return false;
    } finally {
      setLoading(false);
    }
  }, [userProfile, pendingFiles, previewImages]);

  const uploadProfilePicture = useCallback(async (file: File): Promise<boolean> => {
    try {
      const objectUrl = URL.createObjectURL(file);
      if (previewImages.profile) URL.revokeObjectURL(previewImages.profile);
      setPreviewImages(prev => ({ ...prev, profile: objectUrl }));
      setPendingFiles(prev => ({ ...prev, profile: file }));
      setHasUnsavedChanges(true);
      return true;
    } catch (e) {
      console.error("Erreur lors de la création de l'aperçu de la photo de profil:", e);
      setError("Impossible d'afficher la prévisualisation");
      return false;
    }
  }, [previewImages.profile]);

  const uploadBannerPicture = useCallback(async (file: File): Promise<boolean> => {
    try {
      const objectUrl = URL.createObjectURL(file);
      if (previewImages.banner) URL.revokeObjectURL(previewImages.banner);
      setPreviewImages(prev => ({ ...prev, banner: objectUrl }));
      setPendingFiles(prev => ({ ...prev, banner: file }));
      setHasUnsavedChanges(true);
      return true;
    } catch (e) {
      console.error("Erreur lors de la création de l'aperçu de la bannière:", e);
      setError("Impossible d'afficher la prévisualisation");
      return false;
    }
  }, [previewImages.banner]);

  const refreshProfile = useCallback(async () => {
    if (userProfile) {
      await fetchUserProfile(userProfile.id);
    }
  }, [userProfile, fetchUserProfile]);

  const resetPreview = useCallback(() => {
    if (previewImages.profile) URL.revokeObjectURL(previewImages.profile);
    if (previewImages.banner) URL.revokeObjectURL(previewImages.banner);
    setPreviewImages({});
    setPendingFiles({});
    setHasUnsavedChanges(false);
  }, [previewImages]);

  return (
    <UserProfileContext.Provider 
      value={{ 
        userProfile, 
        loading, 
        error, 
        fetchUserProfile, 
        updateUserProfile,
        uploadProfilePicture,
        uploadBannerPicture,
        refreshProfile,
        previewImages,
        hasUnsavedChanges,
        resetPreview,
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
