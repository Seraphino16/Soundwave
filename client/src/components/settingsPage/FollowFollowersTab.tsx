import React, { useState } from 'react';

const FollowFollowersTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');

  const mockUsers = [
    { id: 1, name: 'Alice Martin', email: 'alice@example.com', avatar: 'A' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', avatar: 'B' },
    { id: 3, name: 'Claire Dubois', email: 'claire@example.com', avatar: 'C' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', avatar: 'D' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Abonnements / Abonnés</h2>
      
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'following'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Abonnements (127)
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'followers'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Abonnés (89)
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {mockUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{user.avatar}</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {activeTab === 'following' ? (
                <>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                    Message
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                    Se désabonner
                  </button>
                </>
              ) : (
                <>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                    Message
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Suivre
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors">
          Voir plus
        </button>
      </div>
    </div>
  );
};

export default FollowFollowersTab;