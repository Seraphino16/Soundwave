import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { useUserProfileContext } from '../context/UserProfileContext';
import { userProfileService, Review } from '../services/userProfileService';
import { FeedWave, feedWavesService } from '../services/feedWavesService';
import FeedWaveCard from '../components/waves/FeedWaveCard';
import CreateWaveForm from '../components/waves/CreateWaveForm';
import ReviewCard from '../components/profilePage/ReviewCard';
import ProfileStats from '../components/profilePage/ProfileStats';
import { FiMapPin, FiCalendar } from 'react-icons/fi';

const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId?: string }>();
    const { user } = useUserContext();
    const { userProfile, loading: profileLoading, fetchUserProfile } = useUserProfileContext();
    
    const [waves, setWaves] = useState<FeedWave[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'waves' | 'reviews'>('waves');
    const [isFollowing, setIsFollowing] = useState(false);
    
    const isOwnProfile = !userId || (user && parseInt(userId) === user.id);

    useEffect(() => {
        loadProfileData();
    }, [userId, user]);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            
            let targetUserId: number;
            
            if (userId) {
                targetUserId = parseInt(userId);
            } else if (user) {
                targetUserId = user.id;
            } else {
                return;
            }
            
            await fetchUserProfile(targetUserId);
            
            const [wavesData, reviewsData] = await Promise.all([
                userProfileService.getUserWaves(targetUserId, 1, 8),
                userProfileService.getUserReviews(targetUserId, 1, 6)
            ]);

            setWaves(wavesData.waves);
            setReviews(reviewsData.reviews);
        } catch (error) {
            console.error('Error loading profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        if (!userProfile || isOwnProfile) return;
        
        try {
            await userProfileService.toggleFollow(userProfile.id);
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    const handleLike = (waveId: number) => {
        console.log('Like wave:', waveId);
        // TODO: Implémenter la logique de like
    };

    const handleComment = (waveId: number) => {
        console.log('Comment on wave:', waveId);
        // TODO: Implémenter la logique de commentaire
    };

    const handleCreateWave = async (content: string) => {
        try {
            await feedWavesService.createWave(content);
            await loadProfileData();
        } catch (error) {
            console.error('Error creating wave:', error);
            throw error;
        }
    };

    const handleDelete = async (waveId: number) => {
        try {
            await feedWavesService.deleteWave(waveId);
            setWaves(prev => prev.filter(w => w.id !== waveId));
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Erreur lors de la suppression de la wave");
        }
    };

    const displayProfile = useMemo(() => {
        if (!userProfile) return null;
        
        return {
            id: userProfile.id,
            username: userProfile.username,
            pseudo: userProfile.pseudo,
            bio: userProfile.bio || '',
            location: userProfile.location || '',
            website: userProfile.socialLinks?.spotify || '',
            profileImage: userProfile.profile_picture || '/user-icon.png',
            bannerImage: userProfile.banner_picture || '',
            isVerified: userProfile.is_verified,
            stats: {
                totalWaves: waves.length,
                totalReviews: reviews.length,
                totalLikes: 0,
                totalFollowers: userProfile.followers || 0,
                totalFollowing: userProfile.following || 0,
                averageRating: 4.5,
                joinedDate: userProfile.createdAt
            }
        };
    }, [userProfile, waves.length, reviews.length]);

    const formatJoinDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading || profileLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (!displayProfile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 text-lg mb-4">Profil introuvable</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-primaryBlue text-white rounded-lg hover:bg-[#B0C7E6] transition duration-200 font-semibold shadow-md"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Banner */}
            <div className="relative h-64 md:h-80 overflow-hidden">
                {displayProfile.bannerImage ? (
                    <img
                        src={displayProfile.bannerImage}
                        alt="Banner"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primaryBlue to-purple-600"></div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            </div>

            {/* Profile Header */}
            <div className="relative px-4 sm:px-6 lg:px-8 -mt-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                        {/* Profile Image */}
                        <div className="relative">
                            <img
                                src={displayProfile.profileImage || '/user-icon.png'}
                                alt={displayProfile.pseudo}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                            {displayProfile.isVerified && (
                                <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-lg">✓</span>
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div className="mb-4 md:mb-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            {displayProfile.pseudo}
                                        </h1>
                                        {displayProfile.isVerified && (
                                            <span className="text-blue-500 text-xl">✓</span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 mb-2">@{displayProfile.username}</p>
                                    
                                    {/* Profile details */}
                                    <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500 mb-3">
                                        {displayProfile.location && (
                                            <div className="flex items-center space-x-1">
                                                <FiMapPin className="h-4 w-4" />
                                                <span>{displayProfile.location}</span>
                                            </div>
                                        )}
                                        {displayProfile.website && (
                                            <div className="flex items-center space-x-1">
                                                <span className="text-sm">🔗</span>
                                                <a 
                                                    href={displayProfile.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primaryBlue hover:underline"
                                                >
                                                    {displayProfile.website.replace('https://', '').replace('http://', '')}
                                                </a>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-1">
                                            <FiCalendar className="h-4 w-4" />
                                            <span>Membre depuis {formatJoinDate(displayProfile.stats.joinedDate)}</span>
                                        </div>
                                    </div>

                                    {displayProfile.bio && (
                                        <p className="text-gray-700 max-w-2xl leading-relaxed">
                                            {displayProfile.bio}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    {isOwnProfile ? (
                                        <>
                                            <Link 
                                                to="/settings" 
                                                className="flex items-center justify-center w-10 h-10 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                                title="Paramètres"
                                            >
                                                <span className="text-lg">⚙️</span>
                                            </Link>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleFollowToggle}
                                            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                                                isFollowing
                                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
                                                    : 'bg-primaryBlue text-white hover:bg-[#B0C7E6] shadow-md'
                                            }`}
                                        >
                                            {isFollowing ? (
                                                <>
                                                    <span>✓</span>
                                                    <span>Suivi(e)</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>➕</span>
                                                    <span>Suivre</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar - Stats */}
                    <div className="lg:col-span-1">
                        <ProfileStats stats={displayProfile.stats} />
                    </div>

                    {/* Main Content - Waves and Reviews */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="flex border-b">
                                <button
                                    onClick={() => setActiveTab('waves')}
                                    className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition ${
                                        activeTab === 'waves'
                                            ? 'border-primaryBlue text-primaryBlue'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Waves ({displayProfile.stats.totalWaves})
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`flex-1 py-3 px-4 text-center font-medium border-b-2 transition ${
                                        activeTab === 'reviews'
                                            ? 'border-primaryBlue text-primaryBlue'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Reviews ({displayProfile.stats.totalReviews})
                                </button>
                            </div>
                        </div>

                        {/* Waves Tab */}
                        {activeTab === 'waves' && (
                            <div className="space-y-6">
                                {/* Create Wave Form - Only shown on own profile */}
                                {isOwnProfile && (
                                    <CreateWaveForm 
                                        onSubmit={handleCreateWave}
                                        placeholder="Partagez ce que vous écoutez en ce moment... 🎵"
                                    />
                                )}

                                {waves.length > 0 ? (
                                    <div className="grid gap-6">
                                        {waves
                                            .filter(wave => wave.user)
                                            .map(wave => (
                                                <FeedWaveCard
                                                    key={wave.id}
                                                    wave={wave}
                                                    onLike={handleLike}
                                                    onComment={handleComment}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                        <span className="text-4xl mb-4 block">🎵</span>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {isOwnProfile ? 'Vous n\'avez pas encore créé de waves' : 'Aucune wave disponible'}
                                        </h3>
                                        <p className="text-gray-600">
                                            {isOwnProfile ? 'Commencez à partager votre musique préférée !' : 'Cet utilisateur n\'a pas encore partagé de waves.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                {reviews.length > 0 ? (
                                    <div className="grid gap-6">
                                        {reviews.map(review => (
                                            <ReviewCard
                                                key={review.id}
                                                review={review}
                                                onClick={() => {/* Handle review click */}}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                        <span className="text-4xl mb-4 block">📝</span>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {isOwnProfile ? 'Vous n\'avez pas encore écrit de reviews' : 'Aucune review disponible'}
                                        </h3>
                                        <p className="text-gray-600">
                                            {isOwnProfile ? 'Donnez votre avis sur vos albums préférés !' : 'Cet utilisateur n\'a pas encore écrit de reviews.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
