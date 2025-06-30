/**
 * @description
 * Contexte global de l'application SoundWave pour la gestion de l'état utilisateur et du token d'authentification.
 * Ce contexte permet de :
 * - Stocker et récupérer les informations de l'utilisateur connecté.
 * - Mettre à jour l'utilisateur et son token.
 * - Gérer la déconnexion en nettoyant l'état local et le localStorage.
 * - Assurer la persistance des données utilisateur entre les sessions via localStorage.
 *
 * @property {User | null} user - L'utilisateur actuellement connecté, ou `null` si non connecté.
 * @property {string | null} token - Le token d'authentification associé à l'utilisateur, ou `null` si non connecté.
 * @property {function} setUser - Fonction pour définir ou mettre à jour l'utilisateur et son token.
 * @property {function} logout - Fonction pour déconnecter l'utilisateur et réinitialiser les données stockées.
 * @author SoundWave
 */


import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

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
  token: string | null;
  loading: boolean;
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("user");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserState(parsedData.user || null);
        setTokenState(parsedData.token || null);
      }
    } catch (err) {
      console.error("Erreur lors du chargement de l'utilisateur:", err);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const setUser = (user: User | null, token: string | null) => {
    setUserState(user);
    setTokenState(token);

    if (user && token) {
      localStorage.setItem("user", JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    setUser(null, null);
  };

  return (
    <UserContext.Provider value={{ user, token, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
