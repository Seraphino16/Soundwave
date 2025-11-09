import React, { useEffect, useRef, useState, memo } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Event } from '../../services/eventsService';
import { FiMapPin } from 'react-icons/fi';

interface GoogleEventMapProps {
    events: Event[];
    selectedEvent: Event | null;
    onEventSelect: (event: Event) => void;
    center?: { lat: number; lng: number };
    userLocation?: { latitude: number; longitude: number } | null;
}

interface MapProps {
    events: Event[];
    selectedEvent: Event | null;
    onEventSelect: (event: Event) => void;
    center: { lat: number; lng: number };
    userLocation?: { latitude: number; longitude: number } | null;
}

const EventMarker: React.FC<{
    map: google.maps.Map;
    event: Event;
    isSelected: boolean;
    onClick: () => void;
}> = memo(({ map, event, isSelected, onClick }) => {
    const markerRef = useRef<google.maps.Marker | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    useEffect(() => {
        const marker = new google.maps.Marker({
            position: {
                lat: event.location.latitude,
                lng: event.location.longitude
            },
            map,
            title: event.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: isSelected ? 12 : 8,
                fillColor: isSelected ? '#3B82F6' : '#EF4444',
                fillOpacity: 0.8,
                strokeColor: '#FFFFFF',
                strokeWeight: 2
            }
        });

        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const formattedTime = eventDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const infoContent = `
            <div class="p-3 max-w-xs">
                <h3 class="font-bold text-lg mb-2 text-gray-900">${event.name}</h3>
                <div class="space-y-1 text-sm text-gray-600">
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span>${event.location.venue}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>${formattedDate} - ${formattedTime}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                        </svg>
                        <span>${event.artists.map(a => a.name).join(', ')}</span>
                    </div>
                    ${event.price ? `
                        <div class="mt-2 text-blue-600 font-semibold">
                            ${event.price.min}€ - ${event.price.max}€
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        const infoWindow = new google.maps.InfoWindow({
            content: infoContent
        });

        marker.addListener('click', () => {
            onClick();
            infoWindow.open(map, marker);
        });

        markerRef.current = marker;
        infoWindowRef.current = infoWindow;

        return () => {
            marker.setMap(null);
            infoWindow.close();
        };
    }, [map, event, isSelected, onClick]);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setIcon({
                path: google.maps.SymbolPath.CIRCLE,
                scale: isSelected ? 12 : 8,
                fillColor: isSelected ? '#3B82F6' : '#EF4444',
                fillOpacity: 0.8,
                strokeColor: '#FFFFFF',
                strokeWeight: 2
            });

            if (isSelected && infoWindowRef.current) {
                infoWindowRef.current.open(map, markerRef.current);
            } else if (!isSelected && infoWindowRef.current) {
                infoWindowRef.current.close();
            }
        }
    }, [isSelected, map]);

    return null;
});

const Map: React.FC<MapProps> = ({ events, selectedEvent, onEventSelect, center, userLocation }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    useEffect(() => {
        if (ref.current && !map) {
            const googleMap = new google.maps.Map(ref.current, {
                center,
                zoom: 6,
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }]
                    }
                ]
            });

            setMap(googleMap);

            if (events.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                events.forEach(event => {
                    bounds.extend({
                        lat: event.location.latitude,
                        lng: event.location.longitude
                    });
                });
                
                if (userLocation) {
                    bounds.extend({
                        lat: userLocation.latitude,
                        lng: userLocation.longitude
                    });
                }

                googleMap.fitBounds(bounds);
            }
        }
    }, [ref, map, center, events, userLocation]);

    useEffect(() => {
        if (map && userLocation) {
            new google.maps.Marker({
                position: {
                    lat: userLocation.latitude,
                    lng: userLocation.longitude
                },
                map,
                title: 'Votre position',
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#10B981',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 3
                }
            });
        }
    }, [map, userLocation]);

    return (
        <div className="w-full h-full relative">
            <div ref={ref} className="w-full h-full min-h-[400px] rounded-lg" />
            {map && events.map(event => (
                <EventMarker
                    key={event.id}
                    map={map}
                    event={event}
                    isSelected={selectedEvent?.id === event.id}
                    onClick={() => onEventSelect(event)}
                />
            ))}
        </div>
    );
};

const LoadingMap: React.FC = () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la carte...</p>
        </div>
    </div>
);

const ErrorMap: React.FC<{ status: Status }> = ({ status }) => (
    <div className="w-full h-[400px] bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-red-600">
            <FiMapPin className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold mb-2">Erreur de chargement de la carte</p>
            <p className="text-sm">Status: {status}</p>
            <p className="text-sm mt-2">Veuillez vérifier votre clé API Google Maps</p>
        </div>
    </div>
);

const render = (status: Status): React.ReactElement => {
    switch (status) {
        case Status.LOADING:
            return <LoadingMap />;
        case Status.FAILURE:
            return <ErrorMap status={status} />;
        case Status.SUCCESS:
            return <></>;
        default:
            return <LoadingMap />;
    }
};

const GoogleEventMap: React.FC<GoogleEventMapProps> = ({
    events,
    selectedEvent,
    onEventSelect,
    center = { lat: 46.2276, lng: 2.2137 },
    userLocation
}) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        return (
            <div className="w-full h-[400px] bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-yellow-800">
                    <FiMapPin className="h-12 w-12 mx-auto mb-4" />
                    <p className="font-semibold mb-2">Clé API Google Maps manquante</p>
                    <p className="text-sm">
                        Ajoutez votre clé API Google Maps dans les variables d'environnement:
                    </p>
                    <p className="text-sm font-mono mt-1">REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here</p>
                    <div className="mt-4 p-3 bg-yellow-100 rounded text-xs">
                        <p>En attendant, voici une vue liste des événements :</p>
                        <div className="mt-2 space-y-1">
                            {events.slice(0, 3).map(event => (
                                <div key={event.id} className="flex items-center gap-2">
                                    <FiMapPin className="h-3 w-3" />
                                    <span>{event.name} - {event.location.city}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Wrapper apiKey={API_KEY} render={render} libraries={['places']}>
            <Map
                events={events}
                selectedEvent={selectedEvent}
                onEventSelect={onEventSelect}
                center={center}
                userLocation={userLocation || null}
            />
        </Wrapper>
    );
};

export default memo(GoogleEventMap);
