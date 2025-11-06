/**
 * @description Card pour afficher une wave dans le feed
 * @author SoundWave
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FeedWave } from '../../services/feedWavesService';

interface FeedWaveCardProps {
    wave: FeedWave;
    onLike?: (waveId: number) => void;
    onComment?: (waveId: number) => void;
}

const FeedWaveCard: React.FC<FeedWaveCardProps> = ({ wave, onLike, onComment }) => {
    const [isLiked, setIsLiked] = useState(false);

    if (!wave || !wave.user) {
        console.error('Wave or wave.user undefined:', wave);
        return null;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return `Il y a ${diffMinutes} min`;
            }
            return `Il y a ${diffHours}h`;
        } else if (diffDays === 1) {
            return 'Hier';
        } else if (diffDays < 7) {
            return `Il y a ${diffDays}j`;
        } else {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
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

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
            <div className="p-4">
                <Link 
                    to={`/profile/${wave.user.id}`}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
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
