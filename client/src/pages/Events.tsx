import React, { useState, useEffect } from 'react';
import { 
    FiMap, 
    FiList, 
    FiSearch, 
    FiFilter, 
    FiMapPin, 
    FiRefreshCw,
    FiAlertTriangle,
    FiLoader
} from 'react-icons/fi';
import { eventsService, Event, EventFilters, Artist } from '../services/eventsService';
import GoogleEventMap from '../components/events/GoogleEventMap';
import EventCard from '../components/events/EventCard';
import EventDetailsModal from '../components/events/EventDetailsModal';
import Alert from '../components/utils/Alert';

const Events: React.FC = () => {
    // State management
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedArtist, setSelectedArtist] = useState('');
    const [radiusFilter, setRadiusFilter] = useState<number>(50);
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    
    const [alerts, setAlerts] = useState<Array<{
        id: number;
        title: string;
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
    }>>([]);

    // Load initial data
    useEffect(() => {
        loadInitialData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Apply filters when they change
    useEffect(() => {
        // Only apply filters if events are loaded and there are actual filters or search terms
        if (events.length > 0 && (searchTerm || selectedArtist || dateFromFilter || dateToFilter || (typeFilter && typeFilter !== 'all') || userLocation)) {
            applyFilters();
        } else if (events.length > 0) {
            // No filters active, show all events
            setFilteredEvents(events);
        }
    }, [searchTerm, selectedArtist, radiusFilter, dateFromFilter, dateToFilter, typeFilter, userLocation, events]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadInitialData = async () => {
        try {
            setLoading(true);
            
            const [eventsResponse, artistsResponse] = await Promise.all([
                eventsService.getEvents(),
                eventsService.getArtists()
            ]);
            
            setEvents(eventsResponse.events);
            setFilteredEvents(eventsResponse.events);
            setArtists(artistsResponse);
            
            showAlert('success', 'Événements chargés', `${eventsResponse.events.length} événements trouvés`);
        } catch (error) {
            console.error('Error loading events:', error);
            showAlert('error', 'Erreur', 'Impossible de charger les événements');
        } finally {
            setLoading(false);
        }
    };

    const getUserLocation = async () => {
        try {
            setLoadingLocation(true);
            const location = await eventsService.getUserLocation();
            
            if (location) {
                setUserLocation(location);
                showAlert('success', 'Position trouvée', 'Votre position a été détectée');
            } else {
                showAlert('warning', 'Position non disponible', 'Impossible de détecter votre position');
            }
        } catch (error) {
            console.error('Error getting user location:', error);
            showAlert('error', 'Erreur', 'Erreur lors de la géolocalisation');
        } finally {
            setLoadingLocation(false);
        }
    };

    const applyFilters = async () => {
        try {
            const currentFilters: EventFilters = {};
            
            if (searchTerm || selectedArtist) {
                currentFilters.artist = searchTerm || selectedArtist;
            }
            if (userLocation && radiusFilter) {
                currentFilters.radius = radiusFilter;
                currentFilters.location = userLocation;
            }
            if (dateFromFilter) {
                currentFilters.dateFrom = dateFromFilter;
            }
            if (dateToFilter) {
                currentFilters.dateTo = dateToFilter;
            }
            if (typeFilter && typeFilter !== 'all') {
                currentFilters.type = typeFilter;
            }

            const response = await eventsService.getEvents(currentFilters);
            setFilteredEvents(response.events);
        } catch (error) {
            console.error('Error applying filters:', error);
            showAlert('error', 'Erreur', 'Erreur lors du filtrage des événements');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedArtist('');
        setRadiusFilter(50);
        setDateFromFilter('');
        setDateToFilter('');
        setTypeFilter('all');
        setFilteredEvents(events);
        showAlert('info', 'Filtres réinitialisés', 'Tous les filtres ont été supprimés');
    };

    const showAlert = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
        const newAlert = {
            id: Date.now(),
            title,
            message,
            type
        };
        setAlerts(prev => [...prev, newAlert]);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, 5000);
    };

    const removeAlert = (id: number) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const handleEventSelect = (event: Event) => {
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    const calculateDistance = (event: Event): number | undefined => {
        if (!userLocation) return undefined;
        
        const R = 6371; // Earth's radius in kilometers
        const dLat = (event.location.latitude - userLocation.latitude) * Math.PI / 180;
        const dLon = (event.location.longitude - userLocation.longitude) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(event.location.latitude * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des événements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Événements Musicaux</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Découvrez {filteredEvents.length} événement(s) près de chez vous
                            </p>
                        </div>
                        
                        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                            {/* View mode toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                                        viewMode === 'map' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <FiMap className="h-4 w-4" />
                                    <span>Carte</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                                        viewMode === 'list' 
                                            ? 'bg-white text-gray-900 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <FiList className="h-4 w-4" />
                                    <span>Liste</span>
                                </button>
                            </div>
                            
                            {/* Get location button */}
                            <button
                                onClick={getUserLocation}
                                disabled={loadingLocation}
                                className="flex items-center space-x-2 px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                            >
                                {loadingLocation ? (
                                    <FiLoader className="h-4 w-4 animate-spin" />
                                ) : (
                                    <FiMapPin className="h-4 w-4" />
                                )}
                                <span>Ma position</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Search bar */}
                        <div className="flex-1 max-w-lg">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un événement ou un artiste..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filter toggle and reset */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                <FiFilter className="h-4 w-4" />
                                <span>Filtres</span>
                            </button>
                            
                            <button
                                onClick={resetFilters}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                            >
                                <FiRefreshCw className="h-4 w-4" />
                                <span>Reset</span>
                            </button>
                        </div>
                    </div>

                    {/* Extended filters */}
                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                            {/* Artist filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Artiste
                                </label>
                                <select
                                    value={selectedArtist}
                                    onChange={(e) => setSelectedArtist(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                >
                                    <option value="">Tous les artistes</option>
                                    {artists.map(artist => (
                                        <option key={artist.id} value={artist.name}>
                                            {artist.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Radius filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rayon ({radiusFilter} km)
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="200"
                                    step="5"
                                    value={radiusFilter}
                                    onChange={(e) => setRadiusFilter(Number(e.target.value))}
                                    disabled={!userLocation}
                                    className="w-full"
                                />
                                {!userLocation && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Activez la géolocalisation
                                    </p>
                                )}
                            </div>

                            {/* Date from */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date de début
                                </label>
                                <input
                                    type="date"
                                    value={dateFromFilter}
                                    onChange={(e) => setDateFromFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                />
                            </div>

                            {/* Event type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type d'événement
                                </label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="concert">Concert</option>
                                    <option value="festival">Festival</option>
                                    <option value="tour">Tournée</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {viewMode === 'map' ? (
                    <GoogleEventMap
                        events={filteredEvents}
                        selectedEvent={selectedEvent}
                        onEventSelect={handleEventSelect}
                        userLocation={userLocation}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onClick={() => handleEventSelect(event)}
                                    showDistance={calculateDistance(event)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Aucun événement trouvé
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Essayez de modifier vos critères de recherche ou vos filtres.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Toast notifications */}
            <div className="fixed bottom-0 right-0 m-4 space-y-2 z-50">
                {alerts.map(alert => (
                    <Alert
                        key={alert.id}
                        id={alert.id}
                        type={alert.type}
                        title={alert.title}
                        message={alert.message}
                        onClose={removeAlert}
                    />
                ))}
            </div>

            {/* Event Details Modal */}
            <EventDetailsModal
                event={selectedEvent}
                isOpen={showEventModal}
                onClose={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                }}
                userLocation={userLocation}
            />
        </div>
    );
};

export default Events;
