import React, { useState, useEffect } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { useUserContext } from '../context/UserContext';
import { useUserProfileContext } from '../context/UserProfileContext';

const ProfileSettings: React.FC = () => {
    const { user } = useUserContext();
    const {
        userProfile,
        loading: profileLoading,
        error,
        fetchUserProfile,
        updateUserProfile,
        hasUnsavedChanges,
    } = useUserProfileContext();

    const [profileData, setProfileData] = useState({
        pseudo: '',
        username: '',
        bio: '',
        location: '',
        website: '',
        profileImage: '',
        bannerImage: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchUserProfile(user.id);
        }
    }, [user?.id, fetchUserProfile]);

    useEffect(() => {
        if (userProfile) {
            setProfileData({
                pseudo: userProfile.pseudo || '',
                username: userProfile.username || '',
                bio: userProfile.bio || '',
                location: userProfile.location || '',
                website: userProfile.socialLinks?.Facebook || '',
                profileImage: userProfile.profile_picture || '',
                bannerImage: userProfile.banner_picture || ''
            });
        }
    }, [userProfile]);

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!userProfile) return;
        
        setIsLoading(true);
        try {
            const updateData = {
                pseudo: profileData.pseudo,
                username: profileData.username,
                bio: profileData.bio,
                location: profileData.location,
                socialLinks: {
                    ...userProfile.socialLinks,
                    Facebook: profileData.website
                },
                profile_picture: profileData.profileImage,
                banner_picture: profileData.bannerImage
            };

            const success = await updateUserProfile(updateData);
            if (success) {
                alert('Profil mis à jour avec succès !');
            } else {
                alert('Erreur lors de la mise à jour du profil');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la mise à jour du profil');
        } finally {
            setIsLoading(false);
        }
    };

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Erreur lors du chargement du profil: {error}</p>
                    <button 
                        onClick={() => user?.id && fetchUserProfile(user.id)}
                        className="mt-4 px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-600"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900">Paramètres du profil</h1>
                        <p className="text-gray-600 mt-1">Personnalisez votre profil public</p>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Banner Image */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Image de bannière
                            </label>
                            <div className="relative">
                                <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                                    {profileData.bannerImage ? (
                                        <img
                                            src={profileData.bannerImage}
                                            alt="Bannière"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="text-4xl">📷</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <input
                                        type="url"
                                        placeholder="URL de l'image de bannière"
                                        value={profileData.bannerImage}
                                        onChange={(e) => handleInputChange('bannerImage', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Profile Image */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Photo de profil
                            </label>
                            <div className="flex items-center space-x-4">
                                <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                                    {profileData.profileImage ? (
                                        <img
                                            src={profileData.profileImage}
                                            alt="Profil"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <span className="text-2xl">👤</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="url"
                                        placeholder="URL de la photo de profil"
                                        value={profileData.profileImage}
                                        onChange={(e) => handleInputChange('profileImage', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="inline text-sm mr-1">✏️</span>
                                    Nom d'affichage
                                </label>
                                <input
                                    type="text"
                                    value={profileData.pseudo}
                                    onChange={(e) => handleInputChange('pseudo', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="inline text-sm mr-1">👤</span>
                                    Nom d'utilisateur
                                </label>
                                <input
                                    type="text"
                                    value={profileData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Biographie
                            </label>
                            <textarea
                                rows={4}
                                value={profileData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Parlez-nous de vous..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                            />
                            <p className="text-sm text-gray-500">
                                {profileData.bio.length}/500 caractères
                            </p>
                        </div>

                        {/* Location & Website */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <FiMapPin className="inline h-4 w-4 mr-1" />
                                    Localisation
                                </label>
                                <input
                                    type="text"
                                    value={profileData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="Paris, France"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    <span className="inline text-sm mr-1">🔗</span>
                                    Site web
                                </label>
                                <input
                                    type="url"
                                    value={profileData.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    placeholder="https://votre-site.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Aperçu du profil</h3>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Mini banner */}
                                <div className="h-32 bg-gradient-to-r from-primaryBlue to-purple-600 relative">
                                    {profileData.bannerImage && (
                                        <img
                                            src={profileData.bannerImage}
                                            alt="Aperçu bannière"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                {/* Mini profile */}
                                <div className="px-4 pb-4 -mt-8 relative">
                                    <div className="flex items-end space-x-4">
                                        <img
                                            src={profileData.profileImage || '/user-icon.png'}
                                            alt="Aperçu profil"
                                            className="w-16 h-16 rounded-full border-2 border-white"
                                        />
                                        <div className="pb-2">
                                            <h4 className="font-bold text-gray-900">{profileData.pseudo}</h4>
                                            <p className="text-sm text-gray-600">@{profileData.username}</p>
                                        </div>
                                    </div>
                                    {profileData.bio && (
                                        <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                                            {profileData.bio}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-between items-center">
                            {hasUnsavedChanges && (
                                <p className="text-sm text-orange-600">
                                    ⚠️ Vous avez des modifications non sauvegardées
                                </p>
                            )}
                            <div className="ml-auto">
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading || profileLoading}
                                    className="flex items-center space-x-2 px-6 py-3 bg-primaryBlue text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>💾</span>
                                    <span>{isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
