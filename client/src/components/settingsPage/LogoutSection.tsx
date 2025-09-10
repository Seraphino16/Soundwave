import React, { useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface LogoutSectionProps {
  onLogout?: () => void;
}

const LogoutSection: React.FC<LogoutSectionProps> = ({ onLogout }) => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800">Aucun utilisateur connecté</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Déconnexion</h2>
      
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Attention</h3>
          <p className="text-red-700 mb-4">
            Vous êtes sur le point de vous déconnecter. Cette action fermera votre session actuelle.
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Informations de session</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Utilisateur :</strong> {user.pseudo} ({user.username})</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Compte créé le :</strong> {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
            <p><strong>Statut :</strong> 
              <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                user.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'Actif' : 'Inactif'}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition-all duration-200 transform hover:scale-105 active:scale-95 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoggingOut ? 'Déconnexion en cours...' : 'Se déconnecter'}
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            Vous pourrez vous reconnecter à tout moment avec vos identifiants.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutSection;
