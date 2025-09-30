/**
 * @description Hook personnalisé pour la vérification des permissions admin.
 * Redirige automatiquement si l'utilisateur n'est pas admin.
 * @author SoundWave
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

export const useAdminAuth = () => {
  const { user, loading } = useUserContext();
  const navigate = useNavigate();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (hasCheckedAuth) {
      return;
    }

    setHasCheckedAuth(true);

    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }

    if (!user.roles || !user.roles.includes('ADMIN')) {
      navigate("/home", { replace: true });
      return;
    }
  }, [user, loading, navigate, hasCheckedAuth]);

  const isAdmin = user?.roles?.includes('ADMIN') || false;
  const isAuthenticated = !!user;

  return {
    user,
    loading,
    isAdmin,
    isAuthenticated,
    hasCheckedAuth
  };
};
