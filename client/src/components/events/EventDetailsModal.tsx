import React, { memo } from 'react';
import { Event } from '../../services/eventsService';
import { calculateHaversineDistance } from '../../utils/geoUtils';
import { 
    FiX, 
    FiMapPin, 
    FiCalendar, 
    FiUsers, 
    FiExternalLink, 
    FiTag,
    FiDollarSign,
    FiInfo
} from 'react-icons/fi';

interface EventDetailsModalProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
    userLocation?: { latitude: number; longitude: number } | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
    event,
    isOpen,
    onClose,
    userLocation
}) => {
    if (!isOpen || !event) return null;

    const formatDate = (dateString: string, endDateString?: string) => {
        const startDate = new Date(dateString);
        const endDate = endDateString ? new Date(endDateString) : null;
        
        const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };
        
        if (endDate && endDate.toDateString() !== startDate.toDateString()) {
            return {
                date: `Du ${startDate.toLocaleDateString('fr-FR', dateOptions)} au ${endDate.toLocaleDateString('fr-FR', dateOptions)}`,
                time: `Début: ${startDate.toLocaleTimeString('fr-FR', timeOptions)}`
            };
        } else {
            return {
                date: startDate.toLocaleDateString('fr-FR', dateOptions),
                time: startDate.toLocaleTimeString('fr-FR', timeOptions)
            };
        }
    };

    const calculateDistance = (): number | null => {
        if (!userLocation) return null;
        
        return calculateHaversineDistance(
            userLocation.latitude,
            userLocation.longitude,
            event.location.latitude,
            event.location.longitude
        );
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

    const isEventPast = () => {
        const eventDate = new Date(event.endDate || event.date);
        const now = new Date();
        return eventDate < now;
    };

    const distance = calculateDistance();
    const { date, time } = formatDate(event.date, event.endDate);

    // Handle click outside modal to close
    const handleBackdropClick = (e: React.MouseEvent) => {
        // Close modal when clicking on the backdrop (not on the modal content)
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Prevent modal from closing when clicking inside the modal content
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div 
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={handleModalClick}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 truncate pr-4">
                        {event.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Event image */}
                    {event.image && (
                        <div className="mb-6">
                            <img 
                                src={event.image} 
                                alt={event.name}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                    )}

                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getEventTypeBadgeColor(event.type)}`}>
                            {getEventTypeLabel(event.type)}
                        </span>
                        {event.soldOut && (
                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                                Complet
                            </span>
                        )}
                        {isEventPast() && (
                            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-600">
                                Terminé
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <FiInfo className="text-primaryBlue" />
                            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                        </div>
                        <p className="text-gray-700">{event.description}</p>
                    </div>

                    {/* Event details */}
                    <div className="space-y-4 mb-6">
                        {/* Date and time */}
                        <div className="flex items-start space-x-3">
                            <FiCalendar className="text-primaryBlue mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">{date}</p>
                                <p className="text-sm text-gray-600">{time}</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start space-x-3">
                            <FiMapPin className="text-primaryBlue mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900">{event.location.venue}</p>
                                <p className="text-sm text-gray-600">
                                    {event.location.address}, {event.location.city}, {event.location.country}
                                </p>
                                {distance && (
                                    <p className="text-sm text-primaryBlue">
                                        À {distance.toFixed(1)} km de votre position
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Artists */}
                        <div className="flex items-start space-x-3">
                            <FiUsers className="text-primaryBlue mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-gray-900 mb-2">Artistes</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {event.artists.map(artist => (
                                        <div key={artist.id} className="bg-gray-50 p-3 rounded-lg">
                                            <p className="font-medium text-gray-900">{artist.name}</p>
                                            <p className="text-sm text-gray-600">{artist.genre}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Capacity */}
                        {event.capacity && (
                            <div className="flex items-center space-x-3">
                                <FiUsers className="text-primaryBlue flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-900">Capacité: </span>
                                    <span className="text-gray-700">{event.capacity.toLocaleString()} personnes</span>
                                </div>
                            </div>
                        )}

                        {/* Price */}
                        {event.price && (
                            <div className="flex items-center space-x-3">
                                <FiDollarSign className="text-primaryBlue flex-shrink-0" />
                                <div>
                                    <span className="font-medium text-gray-900">Prix: </span>
                                    <span className="text-gray-700">
                                        {event.price.min === event.price.max 
                                            ? `${event.price.min}€` 
                                            : `${event.price.min}€ - ${event.price.max}€`
                                        }
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {event.tags.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                                <FiTag className="text-primaryBlue" />
                                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {event.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                        {event.ticketUrl && !isEventPast() && (
                            <button
                                onClick={() => window.open(event.ticketUrl, '_blank')}
                                className="flex items-center justify-center space-x-2 px-6 py-3 bg-primaryBlue text-white rounded-lg hover:bg-blue-600 transition font-medium"
                            >
                                <span>Acheter des billets</span>
                                <FiExternalLink className="h-4 w-4" />
                            </button>
                        )}
                        
                        <button
                            onClick={() => {
                                const { latitude, longitude } = event.location;
                                const placeName = encodeURIComponent(`${event.location.venue}, ${event.location.address}, ${event.location.city}`);
                                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${placeName}&center=${latitude},${longitude}`;
                                window.open(mapsUrl, '_blank');
                            }}
                            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            <FiMapPin className="h-4 w-4" />
                            <span>Voir sur la carte</span>
                        </button>

                        {userLocation && (
                            <button
                                onClick={() => {
                                    const { latitude, longitude } = event.location;
                                    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${latitude},${longitude}&travelmode=driving`;
                                    window.open(directionsUrl, '_blank');
                                }}
                                className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                            >
                                <FiExternalLink className="h-4 w-4" />
                                <span>Itinéraire</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(EventDetailsModal);
