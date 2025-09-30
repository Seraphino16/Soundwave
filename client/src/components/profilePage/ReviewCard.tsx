import React from 'react';
import { Review } from '../../services/userProfileService';
import { FiCalendar } from 'react-icons/fi';

interface ReviewCardProps {
    review: Review;
    onClick?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onClick }) => {
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

    return (
        <div 
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100"
            onClick={onClick}
        >
            <div className="p-4">
                {/* Header with album info */}
                <div className="flex items-start space-x-3 mb-3">
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
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <FiCalendar className="h-3 w-3" />
                            <span>{formatDate(review.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                        {review.rating}/5
                    </span>
                </div>

                {/* Review content */}
                <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                    {review.content}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                        <span className="text-lg">♥</span>
                        <span className="text-sm">{review.likes}</span>
                    </button>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        Review
                    </span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ReviewCard);
