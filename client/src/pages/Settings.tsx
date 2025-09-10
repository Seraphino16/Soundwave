/**
 * @description Page des paramètres utilisateur de l'application SoundWave
 * @author SoundWave
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

import EditProfileTab from '../components/settingsPage/EditProfileTab';
import FollowFollowersTab from '../components/settingsPage/FollowFollowersTab';
import ListTab from '../components/settingsPage/ListTab';
import GroupsTab from '../components/settingsPage/GroupsTab';
import SettingsTab from '../components/settingsPage/SettingsTab';
import ThirdPartyAccountsTab from '../components/settingsPage/ThirdPartyAccountsTab';
import LogoutSection from '../components/settingsPage/LogoutSection';

type TabType = 'profile' | 'follow' | 'lists' | 'groups' | 'settings' | 'accounts' | 'logout';

interface MenuItem {
  id: TabType;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
}

const Settings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useUserContext();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const menuItems: MenuItem[] = [
    { id: 'profile', label: 'Profil', icon: '👤', component: EditProfileTab },
    { id: 'follow', label: 'Abonnements/Abonnés', icon: '👥', component: FollowFollowersTab },
    { id: 'lists', label: 'Listes', icon: '📋', component: ListTab },
    { id: 'groups', label: 'Groupes', icon: '👥', component: GroupsTab },
    { id: 'settings', label: 'Paramètres généraux', icon: '⚙️', component: SettingsTab },
    { id: 'accounts', label: 'Comptes tiers', icon: '🔗', component: ThirdPartyAccountsTab },
    { id: 'logout', label: 'Déconnexion', icon: '🚪', component: LogoutSection },
  ];

  // Gestion des paramètres d'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') as TabType;
    if (tab && menuItems.find(item => item.id === tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('profile');
      navigate('/settings?tab=profile', { replace: true });
    }
  }, [location.search, navigate]);

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    navigate(`/settings?tab=${tabId}`);
  };

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || EditProfileTab;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 text-lg">Chargement...</span>
        </div>
      </div>
    );
  }

  // Redirection si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès restreint</h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex">
            <div className="w-80 bg-gradient-to-b from-slate-900 to-slate-800">
              <div className="p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold mb-2">Paramètres</h1>
                <p className="text-sm">Gérez votre compte et vos préférences</p>
              </div>
              <nav className="py-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center px-6 py-4 text-left transition-all duration-200 relative group ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]'
                        : 'text-slate-500 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {activeTab === item.id && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r-full"></div>
                    )}
                    <span className="text-xl mr-4 group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    <div className={`absolute right-4 transition-opacity duration-200 ${
                      activeTab === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="w-2 h-2 bg-current rounded-full"></div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 bg-gray-50">
              <div className="h-full overflow-y-auto">
                <div className="animate-fadeIn">
                  <ActiveComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
