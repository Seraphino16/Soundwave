import React from "react";
import { useNavigate } from "react-router-dom";
import Meta from "../components/utils/Meta";
import { useRequireAdmin } from "../hooks/useRequireAdmin";

const AdminPanel: React.FC = () => {
  const { user, loading, isAdmin } = useRequireAdmin();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto"></div>
        <p className="text-center mt-4">Vérification des permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Meta title="Soundwave - Panel Administrateur" description="Panel d'administration du site SoundWave" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primaryBlue mb-4">🔧 PANEL ADMINISTRATEUR</h1>
            <p className="text-gray-600">Bienvenue dans le panel d'administration, {user?.pseudo}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">👥</span>
                <h3 className="text-xl font-semibold text-gray-800">Gestion des Utilisateurs</h3>
              </div>
              <p className="text-gray-600 mb-4">Gérer les comptes utilisateurs, rôles et permissions.</p>
              <button
                onClick={() => navigate("/admin/users")}
                className="px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-[#B0C7E6] transition font-semibold"
              >
                Accéder
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
