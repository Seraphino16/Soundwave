import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FiUsers, 
    FiMusic, 
    FiRefreshCw,
    FiArrowLeft,
    FiAlertTriangle,
    FiShield,
    FiTrendingUp
} from 'react-icons/fi';
import { adminService, DashboardStats } from '../services/adminService';
import Alert from '../components/utils/Alert';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import SimpleLineChart from '../components/charts/SimpleLineChart';
import SimpleDoughnutChart from '../components/charts/SimpleDoughnutChart';

const AdminDashboard: React.FC = () => {
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
    const [userGrowthData, setUserGrowthData] = useState<any>(null);
    const [contentData, setContentData] = useState<any>(null);
    const [authMethodsData, setAuthMethodsData] = useState<any>(null);
    const [topGenresData, setTopGenresData] = useState<any>(null);
    const [alerts, setAlerts] = useState<Array<{
        id: number;
        title: string;
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
    }>>([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, [period]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            const [stats, userChart, contentChart, authChart] = await Promise.all([
                adminService.getDashboardStats(period),
                adminService.getUserGrowthChart(period),
                adminService.getContentChart(period),
                adminService.getAuthMethodsChart(),
            ]);

            setDashboardStats(stats);
            
            // Convert chart data for our simple charts
            setUserGrowthData({
                labels: userChart.labels.slice(-7), // Show last 7 data points
                data: userChart.datasets[0].data.slice(-7),
                color: '#3B82F6'
            });
            
            setContentData({
                labels: contentChart.labels.slice(-7),
                data: contentChart.datasets[0].data.slice(-7),
                color: '#10B981'
            });
            
            setAuthMethodsData({
                labels: authChart.labels,
                data: authChart.datasets[0].data,
                colors: authChart.datasets[0].backgroundColor
            });
            
            setTopGenresData({
                labels: stats.topContent.genres.map(g => g.name),
                data: stats.topContent.genres.map(g => g.popularity),
                colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
            });
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            showAlert('Error loading dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        const newAlert = {
            id: Date.now(),
            title: type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Info',
            message,
            type
        };
        setAlerts(prev => [...prev, newAlert]);
    };

    const removeAlert = (id: number) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!dashboardStats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <FiAlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Failed to load dashboard data</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/admin')}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                                <FiArrowLeft className="h-5 w-5" />
                                <span>Retour au Panel Admin</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value as any)}
                                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
                            >
                                <option value="day">Aujourd'hui</option>
                                <option value="week">Cette Semaine</option>
                                <option value="month">Ce Mois</option>
                                <option value="year">Cette Année</option>
                            </select>
                            <button
                                onClick={fetchDashboardData}
                                className="flex items-center space-x-2 px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-blue-600"
                            >
                                <FiRefreshCw className="h-4 w-4" />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Tableau de Bord Administrateur</h1>
                    <p className="text-gray-600">Vue d'ensemble des performances et statistiques de la plateforme</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Users Stats */}
                    <div className="bg-white rounded-lg shadow p-6">
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
                    <div className="bg-white rounded-lg shadow p-6">
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
                                <span className="text-gray-600">Playlists</span>
                                <span className="font-medium">{dashboardStats.content.totalPlaylists.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Collaboratives</span>
                                <span className="font-medium">{dashboardStats.content.collaborativePlaylists.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Growth Stats */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Croissance</p>
                                <p className="text-2xl font-bold text-gray-900">+{dashboardStats.users.growthRate}%</p>
                                <p className="text-sm text-blue-600">
                                    Ce mois
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <FiTrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Nouveaux cette semaine</span>
                                <span className="font-medium">{dashboardStats.users.newThisWeek.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Nouveaux ce mois</span>
                                <span className="font-medium">{dashboardStats.users.newThisMonth.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Moderation Stats */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Reports</p>
                                <p className="text-2xl font-bold text-gray-900">{dashboardStats.moderation.reports}</p>
                                <p className="text-sm text-orange-600">
                                    {dashboardStats.moderation.pendingReports} en attente
                                </p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-full">
                                <FiShield className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Résolus</span>
                                <span className="font-medium">{dashboardStats.moderation.resolvedReports}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Actions prises</span>
                                <span className="font-medium">{dashboardStats.moderation.moderationActions}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* User Growth Chart */}
                    {userGrowthData && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <SimpleLineChart 
                                data={userGrowthData} 
                                title="Croissance des Utilisateurs" 
                                height={200}
                            />
                        </div>
                    )}

                    {/* Content Chart */}
                    {contentData && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <SimpleLineChart 
                                data={contentData} 
                                title="Création de Contenu" 
                                height={200}
                            />
                        </div>
                    )}

                    {/* Auth Methods Chart */}
                    {authMethodsData && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <SimpleDoughnutChart 
                                data={authMethodsData} 
                                title="Méthodes d'Authentification" 
                                size={200}
                            />
                        </div>
                    )}

                    {/* Top Genres Chart */}
                    {topGenresData && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Genres Populaires</h3>
                            <SimpleBarChart 
                                data={topGenresData} 
                                height={200}
                            />
                        </div>
                    )}
                </div>

                {/* Top Content Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Albums */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Albums</h3>
                        <div className="space-y-3">
                            {dashboardStats.topContent.albums.map((album, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{album.name}</p>
                                        <p className="text-sm text-gray-600">{album.artist}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{album.views.toLocaleString()}</p>
                                        <p className="text-sm text-gray-600">vues</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Artists */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Artists</h3>
                        <div className="space-y-3">
                            {dashboardStats.topContent.artists.map((artist, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{artist.name}</p>
                                        <p className="text-sm text-gray-600">{artist.followers.toLocaleString()} abonnés</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">{artist.streams.toLocaleString()}</p>
                                        <p className="text-sm text-gray-600">écoutes</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert notifications */}
            {alerts.map(alert => (
                <Alert
                    key={alert.id}
                    id={alert.id}
                    title={alert.title}
                    message={alert.message}
                    type={alert.type}
                    onClose={() => removeAlert(alert.id)}
                />
            ))}
        </div>
    );
};

export default AdminDashboard;
