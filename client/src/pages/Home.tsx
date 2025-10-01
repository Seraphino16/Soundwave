/**
 * @description Page d'accueil du site SoundWave pour les utilisateurs connectés
 * @author SoundWave
 */

import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Meta from "../components/utils/Meta";
import SearchBar from "../components/searchBar/SearchBar";
import FeedWaves from "../components/waves/FeedWaves";

const Home: React.FC = () => {
    const { user, loading, checkAuth } = useUserContext();
    const navigate = useNavigate();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

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
                title="Accueil"
                description="Page d'accueil du site SoundWave"
            />
            
            <div className="relative ml-6 md:ml-10 lg:ml-8 xl:ml-10">
                <div className="hidden lg:block w-[20%]">
                    <SearchBar />
                </div>

                <div className="flex-1 max-w-2xl mx-auto p-4">
                    <FeedWaves />
                </div>
            </div>
        </>
    );
};

export default Home;