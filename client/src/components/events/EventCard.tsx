import React from 'react';
import { Event } from '../../services/eventsService';
import { FiMapPin, FiCalendar, FiUsers, FiClock, FiExternalLink, FiTag } from 'react-icons/fi';

interface EventCardProps {
    event: Event;
    onClick: () => void;
    showDistance?: number | undefined;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, showDistance }) => {
    const formatDate = (dateString: string, endDateString?: string) => {
        const startDate = new Date(dateString);
        const endDate = endDateString ? new Date(endDateString) : null;
        
        const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };
        
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        
        if (endDate && endDate.toDateString() !== startDate.toDateString()) {
            return {
                date: `Du ${startDate.toLocaleDateString('fr-FR', dateOptions)} au ${endDate.toLocaleDateString('fr-FR', dateOptions)}`,
                time: `${startDate.toLocaleTimeString('fr-FR', timeOptions)}`
            };
        } else {
            return {
                date: startDate.toLocaleDateString('fr-FR', dateOptions),
                time: startDate.toLocaleTimeString('fr-FR', timeOptions)
            };
        }
    };

    const getEventTypeLabel = (type: string) => {
        switch (type) {
            case 'festival': return 'Festival';
            case 'concert': return 'Concert';
            case 'tour': return 'Tournée';
            default: return 'Événement';
        }
    };

    const getEventTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'festival': return 'bg-purple-100 text-purple-800';
            case 'concert': return 'bg-blue-100 text-blue-800';
            case 'tour': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isEventSoon = () => {
        const eventDate = new Date(event.date);
        const now = new Date();
        const diffHours = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return diffHours > 0 && diffHours <= 24;
    };

    const isEventPast = () => {
        const eventDate = new Date(event.endDate || event.date);
        const now = new Date();
        return eventDate < now;
    };

    const formatArtists = () => {
        if (event.artists.length <= 2) {
            return event.artists.map(a => a.name).join(', ');
        }
        return `${event.artists.slice(0, 2).map(a => a.name).join(', ')} +${event.artists.length - 2} autres`;
    };

    const { date, time } = formatDate(event.date, event.endDate);

    return (
        <div 
            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 ${
                event.soldOut ? 'border-red-400' : 
                isEventSoon() ? 'border-orange-400' : 
                isEventPast() ? 'border-gray-300' : 'border-primaryBlue'
            } ${isEventPast() ? 'opacity-75' : ''}`}
            onClick={onClick}
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeBadgeColor(event.type)}`}>
                                {getEventTypeLabel(event.type)}
                            </span>
                            {event.soldOut && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                    Complet
                                </span>
                            )}
                            {isEventSoon() && !isEventPast() && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                    Bientôt
                                </span>
                            )}
                            {isEventPast() && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                    Terminé
                                </span>
                            )}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                            {event.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {event.description}
                        </p>
                    </div>
                    
                    {event.image && (
                        <div className="ml-4 flex-shrink-0">
                            <img 
                                src={event.image} 
                                alt={event.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-2 mb-4">
                    {/* Date and time */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiCalendar className="flex-shrink-0 text-primaryBlue" />
                        <span>{date}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiClock className="flex-shrink-0 text-primaryBlue" />
                        <span>{time}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiMapPin className="flex-shrink-0 text-primaryBlue" />
                        <span className="truncate">
                            {event.location.venue}, {event.location.city}
                            {showDistance && (
                                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                                    {showDistance.toFixed(1)} km
                                </span>
                            )}
                        </span>
                    </div>

                    {/* Artists */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FiUsers className="flex-shrink-0 text-primaryBlue" />
                        <span className="truncate">{formatArtists()}</span>
                    </div>
                </div>

                {/* Tags */}
                {event.tags.length > 0 && (
                    <div className="flex items-center space-x-1 mb-3">
                        <FiTag className="text-gray-400 text-xs" />
                        <div className="flex flex-wrap gap-1">
                            {event.tags.slice(0, 3).map((tag, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                            {event.tags.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                    +{event.tags.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Price and ticket link */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm">
                        {event.price ? (
                            <span className="font-semibold text-primaryBlue">
                                {event.price.min === event.price.max 
                                    ? `${event.price.min}€` 
                                    : `${event.price.min}€ - ${event.price.max}€`
                                }
                            </span>
                        ) : (
                            <span className="text-gray-500">Prix non disponible</span>
                        )}
                    </div>
                    
                    {event.ticketUrl && !isEventPast() && (
                        <button 
                            className="flex items-center space-x-1 text-sm text-primaryBlue hover:text-blue-600 font-medium"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(event.ticketUrl, '_blank');
                            }}
                        >
                            <span>Billets</span>
                            <FiExternalLink className="text-xs" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(EventCard);
