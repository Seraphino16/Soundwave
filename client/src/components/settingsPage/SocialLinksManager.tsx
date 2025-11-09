import React, { useState } from 'react';

interface SocialLink {
  platform: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  placeholder: string;
}

interface SocialLinksManagerProps {
  socialLinks: {
    instagram: string;
    twitter: string;
    spotify: string;
    Deezer: string;
    Facebook: string;
  };
  onUpdate: (platform: string, value: string) => void;
  mode?: 'edit' | 'connect';
}

const socialPlatforms: SocialLink[] = [
  {
    platform: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: 'text-pink-600',
    bgColor: 'bg-pink-500',
    placeholder: 'https://instagram.com/username'
  },
  {
    platform: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    placeholder: 'https://twitter.com/username'
  },
  {
    platform: 'spotify',
    name: 'Spotify',
    icon: '🎵',
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    placeholder: 'https://open.spotify.com/artist/...'
  },
  {
    platform: 'Deezer',
    name: 'Deezer',
    icon: '🎧',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500',
    placeholder: 'https://www.deezer.com/fr/profile/...'
  },
  {
    platform: 'Facebook',
    name: 'Facebook',
    icon: '📘',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    placeholder: 'https://facebook.com/username'
  },
];

const SocialLinksManager: React.FC<SocialLinksManagerProps> = ({ 
  socialLinks, 
  onUpdate, 
  mode = 'edit' 
}) => {
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (platform: string, currentValue: string) => {
    setEditingPlatform(platform);
    setTempValue(currentValue);
  };

  const handleSave = (platform: string) => {
    onUpdate(platform, tempValue);
    setEditingPlatform(null);
    setTempValue('');
  };

  const handleCancel = () => {
    setEditingPlatform(null);
    setTempValue('');
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleConsultProfile = (url: string, platformName: string) => {
    if (!isValidUrl(url)) {
      alert(`L'URL pour ${platformName} n'est pas valide.`);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (mode === 'connect') {
    return (
      <div className="space-y-4">
        {socialPlatforms.map((platform) => {
          const isConnected = !!socialLinks[platform.platform as keyof typeof socialLinks];
          
          return (
            <div key={platform.platform} className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${platform.bgColor} rounded-full flex items-center justify-center mr-3`}>
                  <span className="text-white text-lg">{platform.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">{platform.name}</p>
                  <p className={`text-sm ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                    {isConnected ? 'Connecté' : 'Non connecté'}
                  </p>
                  {isConnected && (
                    <p className="text-xs text-gray-400 truncate max-w-xs hover:text-gray-600 transition-colors" title={socialLinks[platform.platform as keyof typeof socialLinks]}>
                      {socialLinks[platform.platform as keyof typeof socialLinks]}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isConnected ? (
                  <>
                    <button 
                      onClick={() => handleConsultProfile(
                        socialLinks[platform.platform as keyof typeof socialLinks], 
                        platform.name
                      )}
                      className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1 min-w-[100px] justify-center"
                      title="Consulter le profil"
                    >
                      <span>🔗</span>
                      <span className="hidden sm:inline">Consulter</span>
                    </button>
                    <button 
                      onClick={() => handleEdit(platform.platform, socialLinks[platform.platform as keyof typeof socialLinks])}
                      className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1 min-w-[100px] justify-center"
                      title="Modifier le lien"
                    >
                      <span>✏️</span>
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button 
                      onClick={() => onUpdate(platform.platform, '')}
                      className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-1 min-w-[100px] justify-center"
                      title="Déconnecter le compte"
                    >
                      <span>🗑️</span>
                      <span className="hidden sm:inline">Déconnecter</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleEdit(platform.platform, '')}
                    className={`px-3 py-2 ${platform.bgColor} text-white text-sm rounded-lg hover:opacity-90 transition-colors flex items-center space-x-1 min-w-[100px] justify-center`}
                  >
                    <span>➕</span>
                    <span>Connecter</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Modal d'édition */}
        {editingPlatform && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {socialLinks[editingPlatform as keyof typeof socialLinks] ? 'Modifier' : 'Ajouter'} {' '}
                {socialPlatforms.find(p => p.platform === editingPlatform)?.name}
              </h3>
              <input
                type="url"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                  !isValidUrl(tempValue) ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder={socialPlatforms.find(p => p.platform === editingPlatform)?.placeholder}
              />
              {!isValidUrl(tempValue) && tempValue && (
                <p className="text-xs text-red-600 mt-1">Veuillez entrer une URL valide</p>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSave(editingPlatform)}
                  disabled={!isValidUrl(tempValue)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {socialPlatforms.map((platform) => (
        <div key={platform.platform}>
          <label className="flex items-center text-sm text-gray-600 mb-1">
            <span className="mr-2">{platform.icon}</span>
            {platform.name}
          </label>
          <input
            type="url"
            value={socialLinks[platform.platform as keyof typeof socialLinks]}
            onChange={(e) => onUpdate(platform.platform, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={platform.placeholder}
          />
        </div>
      ))}
    </div>
  );
};

export default SocialLinksManager;
