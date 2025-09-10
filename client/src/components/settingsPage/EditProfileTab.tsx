/**
 * @description Onglet d'édition du profil utilisateur dans la page des paramètres
 * @author SoundWave
 */

import React, { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";

const EditProfileTab: React.FC = () => {
  const { user, loading } = useUserContext();
  const [formData, setFormData] = useState({
    pseudo: user?.pseudo || "",
    username: user?.username || "",
    bio: "",
    location: "",
    musicPreferences: "",
    socialLinks: "",
  });
  const [usernameError, setUsernameError] = useState("");

  // Mettre à jour les données du formulaire quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setFormData({
        pseudo: user.pseudo || "",
        username: user.username || "",
        bio: "",
        location: "",
        musicPreferences: "",
        socialLinks: "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Gestion spéciale pour le nom d'utilisateur
    if (name === "username") {
      let formattedValue = value;
      // Enlever les espaces et caractères spéciaux (garder uniquement lettres, chiffres, points, tirets et underscores)
      formattedValue = formattedValue.replace(/[^a-zA-Z0-9_.-]/g, "");

      // Validation du nom d'utilisateur
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
    // TODO: Implémenter la logique de sauvegarde
    console.log("Données à sauvegarder:", formData);
  };

  if (loading) {
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil</h2>

      <div className="space-y-6">
        <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-lg border">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{user.pseudo}</h3>
            <p className="text-gray-600 font-mono">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">Changer la photo</button>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Réseaux sociaux</label>
            <input
              type="text"
              name="socialLinks"
              value={formData.socialLinks}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Liens vers vos réseaux sociaux..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-3">Informations du compte</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email :</span>
                <span className="text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date de naissance :</span>
                <span className="text-gray-800">{user.birthdate ? new Date(user.birthdate).toLocaleDateString("fr-FR") : "Non renseignée"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compte vérifié :</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${user.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {user.is_verified ? "✓ Vérifié" : "⚠ Non vérifié"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <span className={`px-2 py-1 rounded-full text-xs ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {user.is_active ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Membre depuis :</span>
                <span className="text-gray-800">{new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          </div>

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
