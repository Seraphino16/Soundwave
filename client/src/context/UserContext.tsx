/**
 * @description Gestion du contexte utilisateur
 * @author SoundWave
 */


import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";

interface User {
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
}

interface UserContextProps {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/users/me", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Utilisateur non authentifié:", errorData.message);
        setUserState(null);
        return;
      }

      const user = await res.json();
      console.log("Utilisateur récupéré:", user);
      setUserState(user);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const checkAuth = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const setUser = useCallback((user: User | null) => {
    setUserState(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5001/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Déconnexion réussie côté serveur");
      } else {
        console.error("Erreur lors de la déconnexion côté serveur");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel de déconnexion:", error);
    }
    setUserState(null);
  }, []);

  return <UserContext.Provider value={{ user, loading, setUser, logout, refreshUser, checkAuth }}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
