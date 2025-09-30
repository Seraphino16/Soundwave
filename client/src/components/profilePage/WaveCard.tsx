import React from 'react';
import { Wave } from '../../services/userProfileService';
import { FiMusic, FiCalendar } from 'react-icons/fi';

interface WaveCardProps {
    wave: Wave;
    onClick?: () => void;
}

const WaveCard: React.FC<WaveCardProps> = ({ wave, onClick }) => {
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
                {/* Header with artist info and album cover */}
                <div className="flex items-start space-x-3 mb-3">
                    {wave.imageUrl && (
                        <img
                            src={wave.imageUrl}
                            alt={wave.album}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                            <FiMusic className="text-primaryBlue h-4 w-4 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-900 truncate">
                                {wave.artist} - {wave.album}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <FiCalendar className="h-3 w-3" />
                            <span>{formatDate(wave.createdAt)}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                {wave.genre}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Wave title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {wave.title}
                </h3>

                {/* Wave description */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {wave.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                        {renderStars(wave.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                        {wave.rating}/5
                    </span>
                </div>

                {/* Tags */}
                {wave.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {wave.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                        {wave.tags.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                +{wave.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                            <span className="text-lg">♥</span>
                            <span className="text-sm">{wave.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                            <span className="text-lg">💬</span>
                            <span className="text-sm">{wave.comments}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(WaveCard);
