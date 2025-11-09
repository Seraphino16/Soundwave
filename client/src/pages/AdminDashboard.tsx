import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiUsers, 
    FiMusic, 
    FiRefreshCw,
    FiArrowLeft,
    FiAlertTriangle,
    FiShield
} from 'react-icons/fi';
import { adminService, DashboardStats, ChartData } from '../services/adminService';
import Alert from '../components/utils/Alert';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import SimpleLineChart from '../components/charts/SimpleLineChart';
import SimpleDoughnutChart from '../components/charts/SimpleDoughnutChart';
import { useRequireAdmin } from '../hooks/useRequireAdmin';

interface AlertState {
    id: number;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

const AdminDashboard: React.FC = () => {
    const { loading: userLoading, isAdmin } = useRequireAdmin();
    
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [userGrowthChart, setUserGrowthChart] = useState<ChartData | null>(null);
    const [contentChart, setContentChart] = useState<ChartData | null>(null);
    const [authMethodsChart, setAuthMethodsChart] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [alerts, setAlerts] = useState<AlertState[]>([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && isAdmin) {
            fetchDashboardData();
        }
    }, [period, isAdmin, userLoading]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [stats, userGrowth, content, authMethods] = await Promise.all([
                adminService.getDashboardStats(period),
                adminService.getUserGrowthChart(period),
                adminService.getContentChart(period),
                adminService.getAuthMethodsChart()
            ]);

            setDashboardStats(stats);
            setUserGrowthChart(userGrowth);
            setContentChart(content);
            setAuthMethodsChart(authMethods);
            setLastUpdated(new Date());
            
            showAlert('Tableau de bord mis à jour avec succès', 'success');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showAlert('Erreur lors du chargement des données', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        const newAlert = {
            id: Date.now(),
            title: type === 'error' ? 'Erreur' : type === 'success' ? 'Succès' : 'Info',
            message,
            type
        };
        setAlerts(prev => [...prev, newAlert]);
        
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }, 3000);
    };

    const removeAlert = (id: number) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    if (userLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        {userLoading ? "Vérification des permissions..." : "Chargement du tableau de bord..."}
                    </p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    if (!dashboardStats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <FiAlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Échec du chargement des données</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Alerts */}
                <div className="fixed top-4 right-4 z-50 space-y-2">
                    {alerts.map(alert => (
                        <Alert
                            key={alert.id}
                            id={alert.id}
                            title={alert.title}
                            message={alert.message}
                            type={alert.type}
                            onClose={removeAlert}
                        />
                    ))}
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <FiArrowLeft className="h-5 w-5" />
                                <span>Retour au Panel Admin</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value as any)}
                                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="day">Aujourd'hui</option>
                                <option value="week">Cette Semaine</option>
                                <option value="month">Ce Mois</option>
                                <option value="year">Cette Année</option>
                            </select>
                            <button
                                onClick={fetchDashboardData}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                <FiRefreshCw className="h-4 w-4" />
                                <span>Actualiser</span>
                            </button>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Tableau de Bord Administrateur</h1>
                    <p className="text-gray-600">Vue d'ensemble des performances et statistiques de la plateforme</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Users Stats */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.users.total.toLocaleString()}</p>
                                <p className="text-sm text-green-600">
                                    +{dashboardStats.users.newToday} aujourd'hui
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <FiUsers className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Actifs</span>
                                <span className="font-medium">{dashboardStats.users.active.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Taux de Croissance</span>
                                <span className="font-medium text-green-600">+{dashboardStats.users.growthRate}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Stats */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Waves</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.content.totalWaves.toLocaleString()}</p>
                                <p className="text-sm text-green-600">
                                    +{dashboardStats.content.newWavesToday} aujourd'hui
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <FiMusic className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Albums</span>
                                <span className="font-medium">{dashboardStats.content.albums.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Artistes</span>
                                <span className="font-medium">{dashboardStats.content.artists.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Moderation Stats */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Signalements</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.moderation.totalReports.toLocaleString()}</p>
                                <p className="text-sm text-yellow-600">
                                    {dashboardStats.moderation.pendingReports} en attente
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <FiShield className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Résolus</span>
                                <span className="font-medium">{dashboardStats.moderation.resolvedReports.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Taux de Résolution</span>
                                <span className="font-medium text-green-600">{dashboardStats.moderation.resolutionRate}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Row - Interactions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Interactions Stats */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.interactions.totalLikes.toLocaleString()}</p>
                                <p className="text-sm text-green-600">
                                    +{dashboardStats.interactions.likesToday} aujourd'hui
                                </p>
                            </div>
                            <div className="bg-pink-100 p-3 rounded-full">
                                <svg className="h-6 w-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Commentaires</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.interactions.totalComments.toLocaleString()}</p>
                                <p className="text-sm text-green-600">
                                    +{dashboardStats.interactions.commentsToday} aujourd'hui
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Partages</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.interactions.totalShares.toLocaleString()}</p>
                                <p className="text-sm text-green-600">
                                    +{dashboardStats.interactions.sharesToday} aujourd'hui
                                </p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Taux d'Engagement</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.interactions.engagementRate}%</p>
                                <p className="text-sm text-gray-600">Performance générale</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Croissance des Utilisateurs</h3>
                        {userGrowthChart ? (
                            <div className="h-80 pb-4">
                                <SimpleLineChart
                                    data={{
                                        labels: userGrowthChart.labels,
                                        data: userGrowthChart.datasets[0]?.data || [],
                                        color: "#3B82F6"
                                    }}
                                    height={300}
                                />
                            </div>
                        ) : (
                            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Chargement du graphique...</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenu Publié</h3>
                        {contentChart ? (
                            <div className="h-80 pb-4">
                                <SimpleBarChart
                                    data={{
                                        labels: contentChart.labels,
                                        data: contentChart.datasets[0]?.data || [],
                                        colors: Array.isArray(contentChart.datasets[0]?.backgroundColor) 
                                            ? contentChart.datasets[0].backgroundColor as string[]
                                            : [contentChart.datasets[0]?.backgroundColor as string || "#10B981"]
                                    }}
                                    height={300}
                                />
                            </div>
                        ) : (
                            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Chargement du graphique...</p>
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Méthodes d'Authentification</h3>
                        {authMethodsChart ? (
                            <div className="h-80 flex flex-col items-center justify-start">
                                <SimpleDoughnutChart
                                    data={{
                                        labels: authMethodsChart.labels,
                                        data: authMethodsChart.datasets[0]?.data || [],
                                        colors: Array.isArray(authMethodsChart.datasets[0]?.backgroundColor) 
                                            ? authMethodsChart.datasets[0].backgroundColor as string[]
                                            : ["#3B82F6", "#10B981", "#F59E0B"]
                                    }}
                                    size={200}
                                />
                            </div>
                        ) : (
                            <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Chargement du graphique...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity and Top Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
                        <div className="space-y-4">
                            {dashboardStats.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FiUsers className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                                        <p className="text-sm text-gray-600">{activity.action}</p>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {activity.timestamp}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Albums */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Albums Populaires</h3>
                        <div className="space-y-4">
                            {dashboardStats.topAlbums.map((album, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{album.name}</p>
                                        <p className="text-sm text-gray-600">par {album.artist}</p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {album.plays.toLocaleString()} écoutes
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional Content Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Genres */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Genres Populaires</h3>
                        <div className="space-y-4">
                            {dashboardStats.topContent.genres.map((genre, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{genre.name}</p>
                                        <p className="text-sm text-gray-600">Popularité: {genre.popularity}%</p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {genre.streams.toLocaleString()} streams
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Playlists */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Playlists Populaires</h3>
                        <div className="space-y-4">
                            {dashboardStats.topContent.playlists.map((playlist, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm font-medium text-gray-900">{playlist.name}</p>
                                            {playlist.isCollaborative && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    Collaborative
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">par {playlist.creator}</p>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {playlist.followers.toLocaleString()} followers
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
                        <div className="text-sm text-gray-600">
                            Dernière mise à jour: {lastUpdated.toLocaleString('fr-FR')}
                        </div>
                        <div className="text-sm text-gray-600">
                            Période sélectionnée: {
                                period === 'day' ? 'Aujourd\'hui' : 
                                period === 'week' ? 'Cette Semaine' :
                                period === 'month' ? 'Ce Mois' : 'Cette Année'
                            }
                        </div>
                        <div className="text-sm text-blue-600 flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Données mises à jour automatiquement</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;