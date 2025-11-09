/**
 * @description Card pour afficher une wave dans le feed
 * @author SoundWave
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FeedWave } from '../../services/feedWavesService';
import { useUserContext } from '../../context/UserContext';

interface FeedWaveCardProps {
    wave: FeedWave;
    onLike?: (waveId: number) => void;
    onComment?: (waveId: number) => void;
    onDelete?: (waveId: number) => void;
}

const FeedWaveCard: React.FC<FeedWaveCardProps> = ({ wave, onLike, onComment, onDelete }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useUserContext();

    // Fermer le menu si on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    if (!wave || !wave.user) {
        console.error('Wave or wave.user undefined:', wave);
        return null;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        
        const dateInParis = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
        const nowInParis = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
        
        const diffTime = Math.abs(nowInParis.getTime() - dateInParis.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return diffMinutes === 0 ? "À l'instant" : `Il y a ${diffMinutes} min`;
            }
            return `Il y a ${diffHours}h`;
        } else if (diffDays === 1) {
            return "Hier";
        } else if (diffDays < 7) {
            return `Il y a ${diffDays}j`;
        } else {
            return dateInParis.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                timeZone: 'Europe/Paris'
            });
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
        onLike?.(wave.id);
    };

    const handleComment = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onComment?.(wave.id);
    };

    const handleDelete = () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette wave ?')) {
            onDelete?.(wave.id);
            setShowMenu(false);
        }
    };

    const isOwnWave = user?.id === wave.user.id;

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <Link 
                        to={`/profile/${wave.user.id}`}
                        className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-1"
                    >
                    <img
                        src={wave.user.profile_picture || '/user-icon.png'}
                        alt={wave.user.pseudo}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primaryBlue/20"
                        onError={(e) => {
                            e.currentTarget.src = '/user-icon.png';
                        }}
                    />
                    <div className="flex-1">
                        <div className="flex items-center space-x-1">
                            <span className="font-semibold text-gray-900">{wave.user.pseudo}</span>
                            {wave.user.is_verified && (
                                <span className="text-blue-500 text-sm" title="Compte vérifié">✓</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>@{wave.user.username}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                                <span className="text-xs">📅</span>
                                <span>{formatDate(wave.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Menu trois points (seulement pour ses propres waves) */}
                {isOwnWave && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Plus d'options"
                        >
                            <span className="text-gray-500 text-xl">⋮</span>
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                    onClick={handleDelete}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                    <span>🗑️</span>
                                    <span>Supprimer</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

                <div className="mt-3">
                    <p className="text-gray-800 text-base whitespace-pre-wrap break-words">
                        {wave.content}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                        <button 
                            onClick={handleLike}
                            className={`flex items-center space-x-2 transition-colors group ${
                                isLiked 
                                    ? 'text-red-500' 
                                    : 'text-gray-500 hover:text-red-500'
                            }`}
                            title={isLiked ? "Contrairement à" : "Aimer"}
                        >
                            <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
                            <span className="text-sm font-medium">
                                {wave.likeCount + (isLiked ? 1 : 0)}
                            </span>
                        </button>

                        <button 
                            onClick={handleComment}
                            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group"
                            title="Commenter"
                        >
                            <span className="text-lg">💬</span>
                            <span className="text-sm font-medium">{wave.commentCount}</span>
                        </button>

                        <div className="flex items-center space-x-2 text-gray-400">
                            <span className="text-lg">🔄</span>
                            <span className="text-sm font-medium">{wave.shareCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FeedWaveCard);
