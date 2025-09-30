import React, { useState } from 'react';

const GroupsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'myGroups' | 'discover'>('myGroups');

  const mockGroups = [
    { id: 1, name: 'Rock Français', description: 'Passionnés de rock français', members: 156, isJoined: true, avatar: 'RF' },
    { id: 2, name: 'Jazz Lovers', description: 'Amateurs de jazz classique et moderne', members: 89, isJoined: true, avatar: 'JL' },
    { id: 3, name: 'Electro Underground', description: 'La scène électro alternative', members: 234, isJoined: false, avatar: 'EU' },
    { id: 4, name: 'Concerts Paris', description: 'Tous les concerts parisiens', members: 567, isJoined: false, avatar: 'CP' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Groupes</h2>
      
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('myGroups')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'myGroups'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mes groupes (2)
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'discover'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Découvrir
          </button>
        </div>
      </div>

      {activeTab === 'myGroups' && (
        <div className="mb-6">
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
            + Créer un nouveau groupe
          </button>
        </div>
      )}

      <div className="space-y-4">
        {mockGroups
          .filter(group => activeTab === 'myGroups' ? group.isJoined : !group.isJoined)
          .map((group) => (
            <div key={group.id} className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{group.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{group.name}</h3>
                    <p className="text-sm text-gray-600">{group.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{group.members} membre{group.members > 1 ? 's' : ''}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {group.isJoined ? (
                    <>
                      <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                        Voir
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                        Quitter
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                        Aperçu
                      </button>
                      <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                        Rejoindre
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {activeTab === 'discover' && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
            Voir plus de groupes
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupsTab;