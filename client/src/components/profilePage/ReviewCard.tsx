import React from 'react';
import { FiCalendar } from 'react-icons/fi';

export interface Review {
    _id: string;
    target_type: 'album' | 'artist';
    target_id: string;
    message: string;
    rating?: number;
    createdAt: string;
    likes?: number;
    username?: string;
    profile_picture?: string;
    targetData?: {
        name: string;
        artistName?: string;
        cover?: string | null;
    };
}

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
            year: 'numeric',
        });
    };

    const renderStars = (rating = 0) => {
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
                {/* === Header Section === */}
                <div className="flex items-start space-x-3 mb-3">
                    {/* Target cover (album/artist) */}
                    <img
                        src={review.targetData?.cover || '/default-cover.png'}
                        alt={review.targetData?.name || 'Image'}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />

                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {review.targetData?.name || (review.target_type === 'album' ? 'Album inconnu' : 'Artiste inconnu')}
                        </h3>

                        {/* Artist name if album */}
                        {review.target_type === 'album' && review.targetData?.artistName && (
                            <p className="text-sm text-gray-600 mb-1 italic">
                                {review.targetData.artistName}
                            </p>
                        )}

                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <FiCalendar className="h-3 w-3" />
                            <span>{formatDate(review.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* === Rating === */}
                {review.rating !== undefined && (
                    <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-600">{review.rating}/5</span>
                    </div>
                )}

                {/* === Review content === */}
                <p className="text-gray-700 text-sm mb-3 line-clamp-4">{review.message}</p>

                {/* === Footer actions === */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-1"></div>
                    {/* Type label */}
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full capitalize">
                        {review.target_type}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ReviewCard);
