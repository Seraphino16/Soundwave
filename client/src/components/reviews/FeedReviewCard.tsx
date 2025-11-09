import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FeedReview } from '../../services/feedWavesService';
import { FiCalendar } from 'react-icons/fi';

interface FeedReviewCardProps {
    review: FeedReview;
    onLike?: (reviewId: number) => void;
    onComment?: (reviewId: number) => void;
}

const FeedReviewCard: React.FC<FeedReviewCardProps> = ({ review, onLike, onComment }) => {
    const [isLiked, setIsLiked] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </span>
        ));
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
        onLike?.(review.id);
    };

    const handleComment = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onComment?.(review.id);
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
            <div className="p-4 pb-0">
                <Link 
                    to={`/profile/${review.user.id}`}
                    className="flex items-center space-x-3 mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                    <img
                        src={review.user.profile_picture || '/user-icon.png'}
                        alt={review.user.pseudo}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <div className="flex items-center space-x-1">
                            <span className="font-semibold text-gray-900">{review.user.pseudo}</span>
                            {review.user.is_verified && (
                                <span className="text-blue-500 text-sm">✓</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">@{review.user.username}</p>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                        <FiCalendar className="h-3 w-3" />
                        <span>{formatDate(review.createdAt)}</span>
                    </div>
                </Link>
            </div>

            <div className="p-4 pt-0">
                <div className="flex items-start space-x-3 mb-4">
                    <img
                        src={review.albumCover}
                        alt={review.albumTitle}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {review.albumTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{review.artist}</p>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                                {review.rating}/5
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed line-clamp-4">
                        {review.content}
                    </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={handleLike}
                            className={`flex items-center space-x-1 transition-colors ${
                                isLiked 
                                    ? 'text-red-500' 
                                    : 'text-gray-500 hover:text-red-500'
                            }`}
                        >
                            <span className={`text-lg ${isLiked ? 'text-red-500' : ''}`}>♥</span>
                            <span className="text-sm">{review.likes + (isLiked ? 1 : 0)}</span>
                        </button>
                        <button 
                            onClick={handleComment}
                            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            <span className="text-lg">💬</span>
                            <span className="text-sm">{review.comments}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(FeedReviewCard);
