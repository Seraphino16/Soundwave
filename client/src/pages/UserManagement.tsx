import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiSearch, FiUsers, FiChevronLeft, FiChevronRight, FiPlus, FiUserX } from "react-icons/fi";
import { adminService, User, UserListResponse, CreateUserData } from "../services/adminService";
import ConfirmModal from "../components/modals/ConfirmModal";
import Alert from "../components/utils/Alert";

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [newRole, setNewRole] = useState("");
    
    // Create user modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createUserData, setCreateUserData] = useState<CreateUserData>({
        username: '',
        email: '',
        pseudo: '',
        password: '',
        role: 'USER',
        birthdate: ''
    });
    
    // Confirmation modal and alert states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [userToBan, setUserToBan] = useState<User | null>(null);
    const [confirmAction, setConfirmAction] = useState<'delete' | 'ban'>('delete');
    const [alerts, setAlerts] = useState<{
        id: number;
        type: 'success' | 'error' | 'info' | 'warning';
        title: string;
        message: string;
    }[]>([]);
    
    const navigate = useNavigate();

    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, search, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response: UserListResponse = await adminService.getAllUsers(
                currentPage,
                itemsPerPage,
                search || undefined,
                roleFilter,
                statusFilter
            );
            setUsers(response.users);
            setTotalPages(response.pagination.totalPages);
            setTotalUsers(response.pagination.totalUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            showAlert("error", "Erreur", "Erreur lors du chargement des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchUsers();
    };

    const showAlert = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
        const newAlert = { 
            id: Date.now(), 
            type, 
            title, 
            message 
        };
        setAlerts(prevAlerts => [...prevAlerts, newAlert]);

        // Auto-remove after 15 seconds
        setTimeout(() => {
            removeAlert(newAlert.id);
        }, 15000);
    };

    const removeAlert = (id: number) => {
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    };

    const handleRoleUpdate = async () => {
        if (!selectedUser || !newRole) return;

        try {
            await adminService.updateUserRole(selectedUser.id, newRole);
            setShowRoleModal(false);
            setSelectedUser(null);
            setNewRole("");
            fetchUsers();
            showAlert("success", "Succès", "Rôle mis à jour avec succès");
        } catch (error) {
            console.error("Error updating role:", error);
            showAlert("error", "Erreur", "Erreur lors de la mise à jour du rôle");
        }
    };

    const handleToggleStatus = async (user: User) => {
        try {
            await adminService.toggleUserStatus(user.id);
            fetchUsers();
            showAlert("success", "Succès", `Utilisateur ${user.is_active ? 'désactivé' : 'activé'} avec succès`);
        } catch (error) {
            console.error("Error toggling status:", error);
            showAlert("error", "Erreur", "Erreur lors de la mise à jour du statut");
        }
    };

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setConfirmAction('delete');
        setShowConfirmModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await adminService.deleteUser(userToDelete.id);
            setShowConfirmModal(false);
            setUserToDelete(null);
            fetchUsers();
            showAlert("success", "Succès", "Utilisateur supprimé avec succès");
        } catch (error) {
            console.error("Error deleting user:", error);
            showAlert("error", "Erreur", "Erreur lors de la suppression de l'utilisateur");
        }
    };

    const cancelAction = () => {
        setShowConfirmModal(false);
        setUserToDelete(null);
        setUserToBan(null);
    };

    const handleConfirmAction = () => {
        if (confirmAction === 'delete') {
            confirmDeleteUser();
        } else if (confirmAction === 'ban') {
            confirmBanUser();
        }
    };

    const handleCreateUser = async () => {
        try {
            // Basic validation
            if (!createUserData.username || !createUserData.email || !createUserData.pseudo || !createUserData.password) {
                showAlert("error", "Erreur", "Tous les champs obligatoires doivent être remplis");
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(createUserData.email)) {
                showAlert("error", "Erreur", "Format d'email invalide");
                return;
            }

            await adminService.createUser(createUserData);
            setShowCreateModal(false);
            resetCreateUserForm();
            fetchUsers();
            showAlert("success", "Succès", "Utilisateur créé avec succès");
        } catch (error) {
            console.error("Error creating user:", error);
            showAlert("error", "Erreur", error instanceof Error ? error.message : "Erreur lors de la création de l'utilisateur");
        }
    };

    const resetCreateUserForm = () => {
        setCreateUserData({
            username: '',
            email: '',
            pseudo: '',
            password: '',
            role: 'USER',
            birthdate: ''
        });
    };

    const handleBanUser = (user: User) => {
        setUserToBan(user);
        setConfirmAction('ban');
        setShowConfirmModal(true);
    };

    const confirmBanUser = async () => {
        if (!userToBan) return;

        try {
            await adminService.banUser(userToBan.id);
            setShowConfirmModal(false);
            setUserToBan(null);
            fetchUsers();
            showAlert("success", "Succès", `Utilisateur ${userToBan.is_active ? 'banni' : 'débanni'} avec succès`);
        } catch (error) {
            console.error("Error banning user:", error);
            showAlert("error", "Erreur", error instanceof Error ? error.message : "Erreur lors du bannissement");
        }
    };

    const getRoleBadgeColor = (roles: string[]) => {
        if (roles.includes('ADMIN')) return 'bg-red-100 text-red-800';
        if (roles.includes('ARTIST')) return 'bg-purple-100 text-purple-800';
        if (roles.includes('BAND')) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FiUsers className="text-2xl text-primaryBlue mr-3" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                                <p className="text-gray-600">{totalUsers} utilisateur(s) au total</p>
                            </div>
                        </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        <FiPlus className="h-4 w-4" />
                        <span>Créer un utilisateur</span>
                    </button>
                    <button
                        onClick={() => navigate("/admin")}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                    >
                        Retour au panel
                    </button>
                </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un utilisateur..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                        >
                            <option value="all">Tous les rôles</option>
                            <option value="USER">Utilisateur</option>
                            <option value="ARTIST">Artiste</option>
                            <option value="ADMIN">Administrateur</option>
                            <option value="BAND">Groupe</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="active">Actif</option>
                            <option value="inactive">Inactif</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Filtrer
                        </button>
                    </form>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Utilisateur
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rôle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Inscription
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.pseudo}</div>
                                                <div className="text-sm text-gray-500">@{user.username}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                            <div className="text-sm text-gray-500">
                                                {user.is_verified ? (
                                                    <span className="text-green-600">✓ Vérifié</span>
                                                ) : (
                                                    <span className="text-orange-600">⚠ Non vérifié</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.roles)}`}>
                                                {user.roles.join(', ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {user.is_active ? (
                                                    <FiToggleRight className="text-green-500 text-xl mr-2" />
                                                ) : (
                                                    <FiToggleLeft className="text-gray-400 text-xl mr-2" />
                                                )}
                                                <span className={`text-sm ${user.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {user.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setNewRole(user.roles[0]);
                                                        setShowRoleModal(true);
                                                    }}
                                                    className="text-primaryBlue hover:text-blue-600"
                                                    title="Modifier le rôle"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`${user.is_active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}
                                                    title={user.is_active ? 'Désactiver' : 'Activer'}
                                                >
                                                    {user.is_active ? <FiToggleLeft /> : <FiToggleRight />}
                                                </button>
                                                {!user.roles.includes('ADMIN') && (
                                                    <>
                                                        <button
                                                            onClick={() => handleBanUser(user)}
                                                            className="text-yellow-600 hover:text-yellow-700"
                                                            title={user.is_active ? 'Bannir' : 'Débannir'}
                                                        >
                                                            <FiUserX />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user)}
                                                            className="text-red-600 hover:text-red-700"
                                                            title="Supprimer"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Précédent
                                </button>
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Suivant
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Affichage de{' '}
                                        <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                                        {' '}à{' '}
                                        <span className="font-medium">
                                            {Math.min(currentPage * itemsPerPage, totalUsers)}
                                        </span>
                                        {' '}sur{' '}
                                        <span className="font-medium">{totalUsers}</span>
                                        {' '}résultats
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FiChevronLeft />
                                    </button>
                                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                                        Page {currentPage} sur {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FiChevronRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Role Update Modal */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Modifier le rôle de {selectedUser.pseudo}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nouveau rôle
                            </label>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                            >
                                <option value="USER">Utilisateur</option>
                                <option value="ARTIST">Artiste</option>
                                <option value="BAND">Groupe</option>
                                <option value="ADMIN">Administrateur</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowRoleModal(false);
                                    setSelectedUser(null);
                                    setNewRole("");
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleRoleUpdate}
                                className="px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-blue-600"
                            >
                                Mettre à jour
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Créer un nouvel utilisateur
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom d'utilisateur *
                                </label>
                                <input
                                    type="text"
                                    value={createUserData.username}
                                    onChange={(e) => setCreateUserData(prev => ({ ...prev, username: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                    placeholder="johndoe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={createUserData.email}
                                    onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pseudo *
                                </label>
                                <input
                                    type="text"
                                    value={createUserData.pseudo}
                                    onChange={(e) => setCreateUserData(prev => ({ ...prev, pseudo: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mot de passe *
                                </label>
                                <input
                                    type="password"
                                    value={createUserData.password}
                                    onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rôle
                                </label>
                                <select
                                    value={createUserData.role}
                                    onChange={(e) => setCreateUserData(prev => ({ ...prev, role: e.target.value as any }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                >
                                    <option value="USER">Utilisateur</option>
                                    <option value="ARTIST">Artiste</option>
                                    <option value="BAND">Groupe</option>
                                    <option value="ADMIN">Administrateur</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date de naissance
                                </label>
                                <input
                                    type="date"
                                    value={createUserData.birthdate}
                                    onChange={(e) => setCreateUserData(prev => ({ ...prev, birthdate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primaryBlue focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetCreateUserForm();
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCreateUser}
                                className="px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-blue-600"
                            >
                                Créer l'utilisateur
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                title={confirmAction === 'delete' ? "Confirmer la suppression" : "Confirmer le bannissement"}
                message={confirmAction === 'delete' ? `Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete?.username} ?` : `Êtes-vous sûr de vouloir ${userToBan?.is_active ? 'bannir' : 'débannir'} l'utilisateur ${userToBan?.username} ?`}
                confirmText={confirmAction === 'delete' ? "Supprimer" : (userToBan?.is_active ? "Bannir" : "Débannir")}
                cancelText="Annuler"
                variant="danger"
                onConfirm={handleConfirmAction}
                onCancel={cancelAction}
            />

            {/* Toast Notification */}
            <div className="fixed bottom-0 right-0 m-4 space-y-2">
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
        </div>
    );
};

export default UserManagement;
