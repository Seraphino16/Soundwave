import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "../../context/UserContext";
import { useUserProfileContext } from "../../context/UserProfileContext";
import DeleteAccountModal from "../modals/DeleteAccountModal";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import { EditProfileTabService, ChangePasswordRequest } from "../../services/editProfileTabService";
import { useAlert } from "../../hooks/useAlert";
import Alert from "../alerts/AlertContainer";

const EditProfileTab: React.FC = () => {
  const { user } = useUserContext();
  const {
    userProfile,
    loading: profileLoading,
    error,
    fetchUserProfile,
    updateUserProfile,
    uploadProfilePicture,
    uploadBannerPicture,
    previewImages,
    hasUnsavedChanges,
    resetPreview,
  } = useUserProfileContext();

  const { alerts, showSuccess, showError, removeAlert } = useAlert();

  const [formData, setFormData] = useState({
    pseudo: "",
    username: "",
    bio: "",
    location: "",
    musicStyle: [] as string[],
    profile_picture: "",
    banner_picture: "",
  });
  const [usernameError, setUsernameError] = useState("");
  const [updateStatus, setUpdateStatus] = useState<"idle" | "updating" | "success" | "error">("idle");
  const [newMusicPreference, setNewMusicPreference] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const profilePictureRef = useRef<HTMLInputElement>(null);
  const bannerPictureRef = useRef<HTMLInputElement>(null);

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
        musicStyle: Array.isArray(userProfile.musicStyle) ? userProfile.musicStyle : [],
        profile_picture: userProfile.profile_picture || "",
        banner_picture: userProfile.banner_picture || "",
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "username") {
      let formattedValue = value;
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

  const addMusicPreference = () => {
    if (newMusicPreference.trim() && formData.musicStyle.length < 5 && !formData.musicStyle.includes(newMusicPreference.trim())) {
      setFormData((prev) => ({
        ...prev,
        musicStyle: [...prev.musicStyle, newMusicPreference.trim()],
      }));
      setNewMusicPreference("");
    }
  };

  const removeMusicPreference = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      musicStyle: prev.musicStyle.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMusicPreference();
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const validation = EditProfileTabService.validateImageFile(file);
    if (!validation.isValid) {
      showError("Erreur de fichier", validation.message!);
      return;
    }

    const success = await uploadProfilePicture(file);
    if (!success) {
      showError("Erreur d'upload", "Impossible de télécharger la photo de profil");
      setUpdateStatus("error");
      setTimeout(() => setUpdateStatus("idle"), 3000);
    } else {
      showSuccess("Image ajoutée", "Photo de profil ajoutée avec succès");
    }
  };

  const handleBannerPictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const validation = EditProfileTabService.validateImageFile(file);
    if (!validation.isValid) {
      showError("Erreur de fichier", validation.message!);
      return;
    }

    const success = await uploadBannerPicture(file);
    if (!success) {
      showError("Erreur d'upload", "Impossible de télécharger la bannière");
      setUpdateStatus("error");
      setTimeout(() => setUpdateStatus("idle"), 3000);
    } else {
      showSuccess("Image ajoutée", "Bannière ajoutée avec succès");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus("updating");

    try {
      const success = await updateUserProfile(formData);
      if (success) {
        setUpdateStatus("success");
        setTimeout(() => setUpdateStatus("idle"), 3000);
      } else {
        setUpdateStatus("error");
        setTimeout(() => setUpdateStatus("idle"), 3000);
      }
    } catch (err) {
      setUpdateStatus("error");
      setTimeout(() => setUpdateStatus("idle"), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    setIsDeleting(true);
    try {
      const result = await EditProfileTabService.deleteAccount(user.id);

      if (result.success) {
        showSuccess("Suppression réussie", "Compte supprimé avec succès. Vous allez être déconnecté.");
        setTimeout(() => {
          EditProfileTabService.clearLocalData();
          EditProfileTabService.redirectToHome();
        }, 2000);
      } else {
        showError("Erreur de suppression", result.message || "Erreur inconnue");
      }
    } catch (error) {
      console.error("Erreur inattendue:", error);
      showError("Erreur inattendue", "Une erreur inattendue s'est produite");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleChangePassword = async (passwordData: ChangePasswordRequest) => {
    if (!user?.id) return;

    setIsChangingPassword(true);
    try {
      const validation = EditProfileTabService.validatePasswordChange(passwordData);
      if (!validation.isValid) {
        showError("Erreur de validation", validation.message!);
        return;
      }

      const result = await EditProfileTabService.changePassword(user.id, passwordData);

      if (result.success) {
        showSuccess("Mot de passe changé", result.message || "Mot de passe modifié avec succès");
        setIsPasswordModalOpen(false);
      } else {
        showError("Erreur de changement", result.message || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      console.error("Erreur inattendue:", error);
      showError("Erreur inattendue", "Une erreur inattendue s'est produite");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const loading = profileLoading || updateStatus === "updating";

  if (profileLoading && !userProfile) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryBlue"></div>
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
            className="mt-2 px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-600 transition-colors hover:cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 hidden sm:block">Profil</h2>

      <div className="space-y-4 sm:space-y-6">
        <div className="bg-gray-100 rounded-lg shadow-xl overflow-hidden">
          <button
            onClick={() => bannerPictureRef.current?.click()}
            className="w-full h-32 sm:h-40 relative hover:opacity-90 transition-opacity cursor-pointer group"
            title="Cliquez pour modifier la bannière"
          >
            {previewImages.banner || userProfile?.banner_picture ? (
              <img src={previewImages.banner || userProfile?.banner_picture || ""} alt="Bannière de profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-slate-300 to-slate-400 flex items-center justify-center">
                <span className="text-white text-lg opacity-70">Cliquez pour ajouter une bannière</span>
              </div>
            )}
            {previewImages.banner && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">Prévisualisation</div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                Modifier la bannière
              </div>
            </div>
          </button>

          <div className="flex flex-col sm:flex-row sm:space-x-6 p-4 sm:p-6">
            <button
              onClick={() => profilePictureRef.current?.click()}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex -mt-12 sm:-mt-16 relative border-4 border-white hover:scale-105 transition-transform duration-200 cursor-pointer group mx-auto sm:mx-0 flex-shrink-0"
              title="Cliquez pour modifier la photo de profil"
            >
              {previewImages.profile || userProfile?.profile_picture ? (
                <img
                  src={previewImages.profile || userProfile?.profile_picture || ""}
                  alt="Profil utilisateur"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-xl sm:text-2xl font-bold flex items-center justify-center w-full h-full">
                  {userProfile?.pseudo?.charAt(0).toUpperCase() || user.pseudo?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
              {previewImages.profile && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Prévisualisation
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-xs text-center">
                  <div>📷</div>
                </div>
              </div>
            </button>
            <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{userProfile?.pseudo || user.pseudo}</h3>
              <p className="text-gray-600 font-mono text-sm sm:text-base">@{userProfile?.username || user.username}</p>
              {userProfile?.bio && <div className="text-sm text-gray-500 pt-2 rounded italic sm:text-left">{userProfile.bio}</div>}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3">
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-bold text-slate-600">{userProfile?.followers || 0}</div>
                  <div className="text-xs text-gray-500">Abonnés</div>
                </div>
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-bold text-slate-600">{userProfile?.following || 0}</div>
                  <div className="text-xs text-gray-500">Abonnements</div>
                </div>
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-bold text-slate-600">{userProfile?.totalPlaylists || 0}</div>
                  <div className="text-xs text-gray-500">Playlists</div>
                </div>
                <div className="text-center">
                  <div className="text-sm sm:text-lg font-bold text-slate-600">{userProfile?.totalEvents || 0}</div>
                  <div className="text-xs text-gray-500">Événements</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {hasUnsavedChanges && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center justify-between">
            <span className="text-amber-700 text-sm">Vous avez des modifications non sauvegardées (images).</span>
            <button
              type="button"
              onClick={resetPreview}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm hover:cursor-pointer"
            >
              Annuler les changements d'images
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pseudo</label>
              <input
                type="text"
                name="pseudo"
                value={formData.pseudo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
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
                  usernameError ? "border-red-300 focus:ring-red-400" : "border-gray-300 focus:ring-primaryBlue"
                }`}
                placeholder="votre_nom_utilisateur"
              />
              {usernameError && <p className="text-xs text-red-600 mt-1">{usernameError}</p>}
              {!usernameError && (
                <p className="text-xs text-gray-500 mt-1">Seuls les lettres, chiffres, points, tirets et underscores sont autorisés.</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
              placeholder="Votre ville"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
              rows={4}
              placeholder="Parlez-nous de vous..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Styles musicaux ({formData.musicStyle.length}/5)</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={newMusicPreference}
                onChange={(e) => setNewMusicPreference(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                placeholder="Ex: Rock, Jazz, Electronic..."
                maxLength={30}
                disabled={formData.musicStyle.length >= 5}
              />
              <button
                type="button"
                onClick={addMusicPreference}
                disabled={!newMusicPreference.trim() || formData.musicStyle.length >= 5 || formData.musicStyle.includes(newMusicPreference.trim())}
                className="px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer w-full sm:w-auto"
              >
                Ajouter
              </button>
            </div>
            {formData.musicStyle.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.musicStyle.map((preference, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-primaryBlue text-white text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <span className="font-medium">{preference}</span>
                    <button
                      type="button"
                      onClick={() => removeMusicPreference(index)}
                      className="ml-1 w-4 h-4 flex items-center justify-center rounded-full transition-colors hover:cursor-pointer"
                      title="Supprimer cette préférence"
                    >
                      <span className="text-xl font-bold">×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.musicStyle.length === 0 && (
              <p className="text-sm text-gray-500 italic">Aucune préférence musicale ajoutée. Ajoutez jusqu'à 5 genres que vous aimez !</p>
            )}

            {formData.musicStyle.length >= 5 && (
              <p className="text-sm text-amber-600">⚠️ Limite atteinte : vous avez ajouté le maximum de 5 Styles musicaux.</p>
            )}
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <p className="text-sm text-slate-600">
              💡 Vous pouvez gérer vos réseaux sociaux dans l'onglet "Comptes tiers" pour une meilleure organisation.
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Informations du compte</h3>
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
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    userProfile?.accountType === "premium"
                      ? "bg-amber-100 text-amber-700"
                      : userProfile?.accountType === "artist"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {userProfile?.accountType === "premium" ? "⭐ Premium" : userProfile?.accountType === "artist" ? "🎵 Artiste" : "🆓 Gratuit"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compte vérifié :</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    userProfile?.is_verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {userProfile?.is_verified ? "✓ Vérifié" : "⚠ Non vérifié"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut :</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    userProfile?.is_active ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {userProfile?.is_active ? "Actif" : "Inactif"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Membre depuis :</span>
                <span className="text-gray-800">{new Date(userProfile?.createdAt || user.createdAt).toLocaleDateString("fr-FR")}</span>
              </div>
              {userProfile?.lastActive && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière activité :</span>
                  <span className="text-gray-800">{new Date(userProfile.lastActive).toLocaleDateString("fr-FR")}</span>
                </div>
              )}
            </div>
            <div className="mt-4 p-4 border border-slate-200 bg-slate-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-700">Sécurité du compte</h4>
                  <p className="text-xs text-slate-600">Modifier votre mot de passe</p>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 bg-primaryBlue hover:cursor-pointer text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  🔒 Changer le mot de passe
                </button>
              </div>
            </div>
            <div className="mt-4 p-4 border border-rose-200 bg-rose-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="text-sm font-medium text-rose-700">Zone de danger</h4>
                  <p className="text-xs text-rose-600">Action irréversible</p>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 bg-rose-500 hover:cursor-pointer text-white text-sm font-medium rounded-lg hover:bg-rose-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
                >
                  🗑️ Supprimer le compte
                </button>
              </div>
            </div>
          </div>
          {userProfile?.favoriteGenres && userProfile.favoriteGenres.length > 0 && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h3 className="text-sm font-medium text-indigo-700 mb-3">Genres musicaux favoris</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.favoriteGenres.map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
          {updateStatus === "success" && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
              <p className="text-emerald-700">✓ Profil mis à jour avec succès !</p>
            </div>
          )}

          {updateStatus === "error" && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
              <p className="text-rose-700">✗ Erreur lors de la mise à jour du profil</p>
            </div>
          )}

          <div className="flex justify-center sm:justify-start">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-400 text-white rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer w-full sm:w-auto font-medium"
              disabled={loading || !!usernameError || formData.username.length < 4}
            >
              {loading ? "Sauvegarde..." : "Sauvegarder les modifications"}
            </button>
          </div>
          <input ref={profilePictureRef} type="file" accept="image/*" onChange={handleProfilePictureUpload} style={{ display: "none" }} />
          <input ref={bannerPictureRef} type="file" accept="image/*" onChange={handleBannerPictureUpload} style={{ display: "none" }} />
        </form>
      </div>
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handleChangePassword}
        isChanging={isChangingPassword}
      />
      <Alert alerts={alerts} onRemoveAlert={removeAlert} />
    </div>
  );
};

export default EditProfileTab;
