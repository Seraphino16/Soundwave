import React, { useState } from 'react';

const SettingsTab: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    events: true,
    recommendations: true,
  });

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showActivity: false,
    allowMessages: true,
    showLocation: false,
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paramètres</h2>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">
                    {key === 'email' && 'Notifications par email'}
                    {key === 'push' && 'Notifications push'}
                    {key === 'sms' && 'Notifications SMS'}
                    {key === 'events' && 'Nouveaux événements'}
                    {key === 'recommendations' && 'Recommandations'}
                  </label>
                  <p className="text-sm text-gray-500">
                    {key === 'email' && 'Recevoir les notifications importantes par email'}
                    {key === 'push' && 'Notifications dans le navigateur'}
                    {key === 'sms' && 'Alertes urgentes par SMS'}
                    {key === 'events' && 'Nouveaux concerts dans votre région'}
                    {key === 'recommendations' && 'Suggestions personnalisées'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange(key as keyof typeof notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Confidentialité</h3>
          <div className="space-y-4">
            {Object.entries(privacy).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">
                    {key === 'profilePublic' && 'Profil public'}
                    {key === 'showActivity' && 'Activité visible'}
                    {key === 'allowMessages' && 'Autoriser les messages'}
                    {key === 'showLocation' && 'Partager la localisation'}
                  </label>
                  <p className="text-sm text-gray-500">
                    {key === 'profilePublic' && 'Votre profil est visible par tous'}
                    {key === 'showActivity' && 'Votre activité est visible par vos abonnés'}
                    {key === 'allowMessages' && 'Autres utilisateurs peuvent vous contacter'}
                    {key === 'showLocation' && 'Votre ville est visible sur votre profil'}
                  </p>
                </div>
                <button
                  onClick={() => handlePrivacyChange(key as keyof typeof privacy)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Préférences générales</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Automatique</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Zone de danger</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              Télécharger mes données
            </button>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;