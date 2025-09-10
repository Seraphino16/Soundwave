import React from 'react';

const ThirdPartyAccountsTab: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Comptes tiers</h2>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Services connectés</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">S</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Spotify</p>
                  <p className="text-sm text-gray-500">Connecté</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Déconnecter
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">G</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Google</p>
                  <p className="text-sm text-gray-500">Non connecté</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Connecter
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note :</strong> La connexion à des comptes tiers vous permet de synchroniser vos données et d'améliorer votre expérience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThirdPartyAccountsTab;
