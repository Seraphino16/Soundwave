import React, { useState } from 'react';

const ListTab: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const mockLists = [
    { id: 1, name: 'Mes favoris', description: 'Mes artistes et albums préférés', itemCount: 24, isPublic: true },
    { id: 2, name: 'À découvrir', description: 'Nouveautés à écouter', itemCount: 12, isPublic: false },
    { id: 3, name: 'Concerts 2024', description: 'Artistes vus en concert cette année', itemCount: 8, isPublic: true },
    { id: 4, name: 'Musique de travail', description: 'Pour rester concentré', itemCount: 45, isPublic: false },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mes Listes</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nouvelle liste
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Créer une nouvelle liste</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la liste</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ma nouvelle liste..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Description de la liste..."
              ></textarea>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="isPublic" className="mr-2" />
              <label htmlFor="isPublic" className="text-sm text-gray-700">Liste publique</label>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {mockLists.map((list) => (
          <div key={list.id} className="p-4 bg-white border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{list.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{list.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  list.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {list.isPublic ? 'Publique' : 'Privée'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">{list.itemCount} élément{list.itemCount > 1 ? 's' : ''}</span>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                  Voir
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                  Modifier
                </button>
                <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListTab;