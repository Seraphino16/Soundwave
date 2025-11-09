import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

export const useRequireAdmin = () => {
  const { user, loading } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const checkAuth = () => {

      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      const isAdmin = user.roles?.includes('ADMIN');

      if (!isAdmin) {
        navigate("/home", { replace: true });
        return;
      }
    };

    const timeoutId = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [user, loading, navigate]);

  return {
    user,
    loading,
    isAdmin: user?.roles?.includes('ADMIN') || false,
    isAuthenticated: !!user
  };
};
