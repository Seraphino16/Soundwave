/**
 * @description Section des paramètres pour gérer les comptes tiers (Instagram, Twitter, Spotify, Deezer, Facebook)
 * @author SoundWave
 */

import React, { useState, useEffect } from 'react';
import { useUserContext } from "../../context/UserContext";
import { useUserProfileContext } from "../../context/UserProfileContext";
import SocialLinksManager from "./SocialLinksManager";

const ThirdPartyAccountsTab: React.FC = () => {
  const { user } = useUserContext();
  const { userProfile, loading, error, fetchUserProfile, updateUserProfile } = useUserProfileContext();
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    twitter: "",
    spotify: "",
    Deezer: "",
    Facebook: "",
  });

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id);
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    if (userProfile && userProfile.socialLinks) {
      setSocialLinks({
        instagram: userProfile.socialLinks.instagram || "",
        twitter: userProfile.socialLinks.twitter || "",
        spotify: userProfile.socialLinks.spotify || "",
        Deezer: userProfile.socialLinks.Deezer || "",
        Facebook: userProfile.socialLinks.Facebook || "",
      });
    }
  }, [userProfile]);

  const handleSocialLinkUpdate = async (platform: string, value: string) => {
    const updatedLinks = {
      ...socialLinks,
      [platform]: value,
    };
    
    setSocialLinks(updatedLinks);
    
    try {
      await updateUserProfile({
        socialLinks: updatedLinks,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des liens sociaux:', error);
    }
  };

  if (loading && !userProfile) {
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
          <p className="text-red-800">Erreur lors du chargement: {error}</p>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Comptes tiers</h2>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Réseaux sociaux</h3>
          
          <SocialLinksManager 
            socialLinks={socialLinks}
            onUpdate={handleSocialLinkUpdate}
            mode="connect"
          />
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note :</strong> La connexion à vos réseaux sociaux vous permet de partager votre profil et d'améliorer votre visibilité.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThirdPartyAccountsTab;
