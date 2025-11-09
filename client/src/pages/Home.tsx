import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Meta from "../components/utils/Meta";
import SearchBar from "../components/searchBar/SearchBar";
import FeedWaves from "../components/waves/FeedWaves";
import CreateWaveForm from "../components/waves/CreateWaveForm";
import { feedWavesService } from "../services/feedWavesService";

const Home: React.FC = () => {
    const { user, loading, checkAuth } = useUserContext();
    const navigate = useNavigate();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const verifyAuth = async () => {
            if (!hasCheckedAuth) {
                await checkAuth();
                setHasCheckedAuth(true);
            }
        };
        
        verifyAuth();
    }, [checkAuth, hasCheckedAuth]);

    useEffect(() => {
        if (hasCheckedAuth && !loading && !user) {
            navigate("/auth");
        }
    }, [user, loading, navigate, hasCheckedAuth]);

    const handleCreateWave = async (content: string) => {
        try {
            await feedWavesService.createWave(content);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Erreur lors de la création de la wave:", error);
            throw error;
        }
    };

    useEffect(() => {
        const verifyAuth = async () => {
            if (!hasCheckedAuth) {
                await checkAuth();
                setHasCheckedAuth(true);
            }
        };
        
        verifyAuth();
    }, [checkAuth, hasCheckedAuth]);

    useEffect(() => {
        if (hasCheckedAuth && !loading && !user) {
            navigate("/auth");
        }
    }, [user, loading, navigate, hasCheckedAuth]);

    if (loading || !hasCheckedAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Chargement...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <Meta
                title="Soundwave - Accueil"
                description="Page d'accueil du site SoundWave"
            />
            
            <div className="relative ml-6 md:ml-10 lg:ml-8 xl:ml-10">
                <div className="hidden lg:block w-[20%]">
                    <SearchBar />
                </div>

                <div className="flex-1 max-w-2xl mx-auto p-4">
                    <CreateWaveForm onSubmit={handleCreateWave} />
                    <div className="mt-6">
                        <FeedWaves key={refreshKey} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;