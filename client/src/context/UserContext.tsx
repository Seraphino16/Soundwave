import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

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
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserState(parsedData.user || null);
      setTokenState(parsedData.token || null);
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
    <UserContext.Provider value={{ user, token, setUser, logout }}>
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