import React, { useState, useEffect } from "react";
import { feedWavesService, FeedWave } from "../../services/feedWavesService";
import FeedWaveCard from "./FeedWaveCard";

const FeedWaves: React.FC = () => {
    const [waves, setWaves] = useState<FeedWave[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadWaves();
    }, []);

    const loadWaves = async () => {
        try {
            setLoading(true);
            const result = await feedWavesService.getFeedWaves();
            setWaves(result.waves);
            setError(null);
        } catch (err) {
            setError("Erreur lors du chargement des waves");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (waveId: number) => {
        try {
            await feedWavesService.toggleLike(waveId);
        } catch (error) {
            console.error("Erreur lors du like:", error);
        }
    };

    const handleDelete = async (waveId: number) => {
        try {
            await feedWavesService.deleteWave(waveId);
            setWaves(prev => prev.filter(w => w.id !== waveId));
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Erreur lors de la suppression de la wave");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryBlue"></div>
                <span className="ml-3 text-gray-600">Chargement des waves...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={loadWaves}
                    className="px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (waves.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Aucune wave à afficher pour le moment</p>
                <p className="text-sm text-gray-500">Suivez des utilisateurs pour voir leurs waves ici</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {waves
                .filter(wave => wave.user)
                .map((wave) => (
                    <FeedWaveCard
                        key={wave.id}
                        wave={wave}
                        onLike={handleLike}
                        onDelete={handleDelete}
                    />
                ))}
        </div>
    );
};

export default FeedWaves;
