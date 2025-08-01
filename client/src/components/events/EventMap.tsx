import React from 'react';
import { Event } from '../../services/eventsService';
import { FiMapPin, FiCalendar, FiUsers, FiExternalLink } from 'react-icons/fi';

interface EventMapProps {
    events: Event[];
    selectedEvent: Event | null;
    onEventSelect: (event: Event) => void;
    center?: { latitude: number; longitude: number };
    userLocation?: { latitude: number; longitude: number } | null;
}

const EventMap: React.FC<EventMapProps> = ({
    events,
    selectedEvent,
    onEventSelect,
    center = { latitude: 48.8566, longitude: 2.3522 }, // Default to Paris
    userLocation
}) => {
    // Helper function to create Google Maps URL with coordinates
    const createGoogleMapsUrl = (event: Event) => {
        const { latitude, longitude } = event.location;
        const placeName = encodeURIComponent(`${event.location.venue}, ${event.location.address}, ${event.location.city}`);
        return `https://www.google.com/maps/search/?api=1&query=${placeName}&query_place_id=${latitude},${longitude}`;
    };
    // Calculate bounds to show all events
    const getBounds = () => {
        if (events.length === 0) return { minLat: center.latitude, maxLat: center.latitude, minLng: center.longitude, maxLng: center.longitude };
        
        const lats = events.map(event => event.location.latitude);
        const lngs = events.map(event => event.location.longitude);
        
        return {
            minLat: Math.min(...lats),
            maxLat: Math.max(...lats),
            minLng: Math.min(...lngs),
            maxLng: Math.max(...lngs)
        };
    };

    const bounds = getBounds();
    const mapHeight = 400; // pixels

    // Convert coordinates to screen position (simplified projection)
    const coordToScreen = (lat: number, lng: number) => {
        const latRange = bounds.maxLat - bounds.minLat || 0.1;
        const lngRange = bounds.maxLng - bounds.minLng || 0.1;
        
        const x = ((lng - bounds.minLng) / lngRange) * 90 + 5; // 5% margin
        const y = ((bounds.maxLat - lat) / latRange) * 80 + 10; // 10% margin
        
        return { x: Math.max(2, Math.min(98, x)), y: Math.max(5, Math.min(95, y)) };
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'festival': return 'bg-purple-500';
            case 'concert': return 'bg-blue-500';
            case 'tour': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200" style={{ height: mapHeight }}>
            {/* Map background with grid */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                <svg className="w-full h-full opacity-20">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Map title */}
            <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md z-10">
                <div className="flex items-center space-x-2">
                    <FiMapPin className="text-primaryBlue" />
                    <div>
                        <span className="text-sm font-semibold text-gray-700">
                            {events.length} événement(s) trouvé(s)
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                            Cliquez pour sélectionner • Double-cliquez pour ouvrir dans Google Maps
                        </p>
                    </div>
                </div>
            </div>

            {/* User location marker */}
            {userLocation && (
                <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{
                        left: `${coordToScreen(userLocation.latitude, userLocation.longitude).x}%`,
                        top: `${coordToScreen(userLocation.latitude, userLocation.longitude).y}%`
                    }}
                >
                    <div className="relative">
                        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                        <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 rounded-full opacity-30 animate-ping"></div>
                        <div className="absolute -bottom-6 -left-6 text-xs bg-red-500 text-white px-2 py-1 rounded whitespace-nowrap">
                            Votre position
                        </div>
                    </div>
                </div>
            )}

            {/* Event markers */}
            {events.map((event) => {
                const position = coordToScreen(event.location.latitude, event.location.longitude);
                const isSelected = selectedEvent?.id === event.id;
                
                return (
                    <div
                        key={event.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-15"
                        style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`
                        }}
                        onClick={() => onEventSelect(event)}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            window.open(createGoogleMapsUrl(event), '_blank');
                        }}
                        title={`${event.name} - Double-cliquez pour ouvrir dans Google Maps`}
                    >
                        {/* Event marker */}
                        <div className={`relative transition-all duration-200 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                            <div className={`w-8 h-8 rounded-full border-3 border-white shadow-lg flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                                <FiMapPin className="text-white text-sm" />
                            </div>
                            
                            {/* Event sold out indicator */}
                            {event.soldOut && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                            )}
                        </div>

                        {/* Event popup on hover/select */}
                        {isSelected && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-64 z-30">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-900 text-sm">{event.name}</h3>
                                    
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                        <FiCalendar className="flex-shrink-0" />
                                        <span>{formatDate(event.date)}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                        <FiMapPin className="flex-shrink-0" />
                                        <span className="truncate">{event.location.venue}, {event.location.city}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                                        <FiUsers className="flex-shrink-0" />
                                        <span className="truncate">
                                            {event.artists.slice(0, 2).map(a => a.name).join(', ')}
                                            {event.artists.length > 2 && ` +${event.artists.length - 2}`}
                                        </span>
                                    </div>

                                    {event.price && (
                                        <div className="text-xs font-semibold text-primaryBlue">
                                            {event.price.min}€ - {event.price.max}€
                                        </div>
                                    )}

                                    {event.soldOut && (
                                        <div className="text-xs font-semibold text-red-600">
                                            Complet
                                        </div>
                                    )}

                                    {/* Google Maps button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(createGoogleMapsUrl(event), '_blank');
                                        }}
                                        className="mt-2 w-full flex items-center justify-center space-x-1 px-2 py-1.5 text-xs bg-primaryBlue text-white rounded hover:bg-blue-600 transition"
                                    >
                                        <FiExternalLink className="h-3 w-3" />
                                        <span>Ouvrir dans Google Maps</span>
                                    </button>
                                </div>
                                
                                {/* Arrow pointing down */}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
                <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Festival</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Concert</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Tournée</span>
                    </div>
                    {userLocation && (
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span>Votre position</span>
                        </div>
                    )}
                </div>
            </div>

            {/* No events message */}
            {events.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <FiMapPin className="mx-auto text-4xl mb-2" />
                        <p className="text-lg font-medium">Aucun événement trouvé</p>
                        <p className="text-sm">Essayez de modifier vos filtres</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(EventMap);
