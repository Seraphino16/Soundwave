/**
 * @description Onglet d'édition du profil utilisateur dans la page des paramètres
 * @author SoundWave
 */

import React, { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { useUserProfileContext } from "../../context/UserProfileContext";

const EditProfileTab: React.FC = () => {
  const { user } = useUserContext();
  const { userProfile, loading: profileLoading, error, fetchUserProfile, updateUserProfile } = useUserProfileContext();
  const [formData, setFormData] = useState({
    pseudo: "",
    username: "",
    bio: "",
    location: "",
    musicPreferences: "",
    profile_picture: "",
    banner_picture: "",
  });
  const [usernameError, setUsernameError] = useState("");
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'updating' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        pseudo: userProfile.pseudo || "",
        username: userProfile.username || "",
        bio: userProfile.bio || "",
        location: userProfile.location || "",
        musicPreferences: userProfile.musicPreferences || "",
        profile_picture: userProfile.profile_picture || "",
        banner_picture: userProfile.banner_picture || "",
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Gestion de la validation du nom d'utilisateur
    if (name === "username") {
      let formattedValue = value;
      // Garde uniquement lettres, chiffres, points, tirets et underscores
      formattedValue = formattedValue.replace(/[^a-zA-Z0-9_.-]/g, "");

      if (formattedValue.length < 3) {
        setUsernameError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      } else if (formattedValue.length > 30) {
        setUsernameError("Le nom d'utilisateur ne peut pas dépasser 30 caractères");
      } else {
        setUsernameError("");
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus('updating');
    
    try {
      const success = await updateUserProfile(formData);
      if (success) {
        setUpdateStatus('success');
        setTimeout(() => setUpdateStatus('idle'), 3000);
      } else {
        setUpdateStatus('error');
        setTimeout(() => setUpdateStatus('idle'), 3000);
      }
    } catch (err) {
      setUpdateStatus('error');
      setTimeout(() => setUpdateStatus('idle'), 3000);
    }
  };

  const loading = profileLoading || updateStatus === 'updating';

  if (profileLoading && !userProfile) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">Aucun utilisateur connecté</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-800">Erreur lors du chargement du profil: {error}</p>
          <button 
            onClick={() => fetchUserProfile(user.id)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil</h2>

      <div className="space-y-6">
        <div className="flex space-x-6 p-6 bg-gray-100 rounded-lg border shadow-xl">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex">
            {userProfile?.profile_picture ? (
              <img 
                src={userProfile.profile_picture} 
                alt="Photo de profil" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-red-500 text-2xl font-bold">
                {userProfile?.pseudo?.charAt(0).toUpperCase() || user.pseudo?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">{userProfile?.pseudo || user.pseudo}</h3>
            <p className="text-gray-600 font-mono">{userProfile?.username || user.username}</p>
            <p className="text-sm text-gray-500">{userProfile?.email || user.email}</p>
            
            {/* Statistiques du profil */}
            <div className="flex items-center space-x-4 mt-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{userProfile?.followers || 0}</div>
                <div className="text-xs text-gray-500">Abonnés</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">{userProfile?.following || 0}</div>
                <div className="text-xs text-gray-500">Abonnements</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{userProfile?.totalPlaylists || 0}</div>
                <div className="text-xs text-gray-500">Playlists</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{userProfile?.totalEvents || 0}</div>
                <div className="text-xs text-gray-500">Événements</div>
              </div>
            </div>
            
            <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Changer la photo
            </button>
            <button className="mt-3 ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Changer la bannière
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pseudo</label>
              <input
                type="text"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre pseudo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent font-mono ${
                  usernameError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
                placeholder="votre_nom_utilisateur"
              />
              {usernameError && <p className="text-xs text-red-600 mt-1">{usernameError}</p>}
              {!usernameError && (
                <p className="text-xs text-gray-500 mt-1">
                  Votre nom d'utilisateur doit être unique. Seuls les lettres, chiffres, points, tirets et underscores sont
                  autorisés.
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre ville"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Parlez-nous de vous..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Préférences musicales</label>
            <input
              type="text"
              name="musicPreferences"
              value={formData.musicPreferences}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Écrivez ici vos préférences musicales..."
            />
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>💡 Astuce :</strong> Vous pouvez gérer vos réseaux sociaux dans l'onglet "Comptes tiers" pour une meilleure organisation.
            </p>
          </div>

          {/* Informations du compte */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-3">Informations du compte</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email :</span>
                <span className="text-gray-800">{userProfile?.email || user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date de naissance :</span>
                <span className="text-gray-800">
                  {userProfile?.birthdate ? new Date(userProfile.birthdate).toLocaleDateString("fr-FR") : "Non renseignée"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type de compte :</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  userProfile?.accountType === 'premium' ? 'bg-gold-100 text-gold-800' :
                  userProfile?.accountType === 'artist' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {userProfile?.accountType === 'premium' ? '⭐ Premium' :
                   userProfile?.accountType === 'artist' ? '🎵 Artiste' : 
                   '🆓 Gratuit'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compte vérifié :</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  userProfile?.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {userProfile?.is_verified ? "✓ Vérifié" : "⚠ Non vérifié"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  userProfile?.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {userProfile?.is_active ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Membre depuis :</span>
                <span className="text-gray-800">
                  {new Date(userProfile?.createdAt || user.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {userProfile?.lastActive && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière activité :</span>
                  <span className="text-gray-800">
                    {new Date(userProfile.lastActive).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Genres musicaux favoris */}
          {userProfile?.favoriteGenres && userProfile.favoriteGenres.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="text-sm font-medium text-purple-800 mb-3">Genres musicaux favoris</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.favoriteGenres.map((genre, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Styles musicaux */}
          {userProfile?.musicStyle && userProfile.musicStyle.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-sm font-medium text-green-800 mb-3">Styles musicaux</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.musicStyle.map((style, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Feedback de mise à jour */}
          {updateStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-green-800">✓ Profil mis à jour avec succès !</p>
            </div>
          )}
          
          {updateStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-800">✗ Erreur lors de la mise à jour du profil</p>
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !!usernameError || formData.username.length < 4}
          >
            {loading ? "Sauvegarde..." : "Sauvegarder les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileTab;
