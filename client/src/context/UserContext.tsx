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
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/users/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const user = await res.json();
      setUserState(user);
    } catch {
      setUserState(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const refreshUser = async () => {
    await fetchUser();
  };

  const setUser = (user: User | null) => {
    setUserState(user);
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5001/auth/logout", {
        credentials: "include",
      });
    } catch {}
    setUserState(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout, refreshUser }}>
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
