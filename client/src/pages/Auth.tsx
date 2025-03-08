/**
 * @description Page d'authentification du site SoundWave
 * @author SoundWave
 */

import React from "react";
import Meta from "../components/utils/Meta";
import RegisterCard from "../components/cards/RegisterCard";
import LoginCard from "../components/cards/LoginCard";

const Auth: React.FC = () => {
    return (
        <>
            <Meta
                title="Authentification Page"
                description="Page d'authentification du site SoundWave"
                // Rajouter la canonical URL quand il y en aura une (valable pour toutes les pages)
            />

            <div className="flex flex-col items-center justify-center">
                <div className="w-[80%] bg-white/60 rounded-2xl p-8 shadow-lg py-12 text-primaryBlue text-center space-y-12">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold mb-4">
                        Bienvenue sur SoundWave 🎵
                    </h1>
                    <p className="mb-2">
                        SoundWave est le réseau social ultime pour tous les
                        passionnés de musique. Échangez avec d'autres mélomanes,
                        partagez vos coups de cœur et découvrez de nouveaux
                        sons.
                    </p>
                    <p className="mb-2">
                        Retrouvez une collection complète d'albums, d'artistes
                        et de morceaux classés avec soin. Explorez, écoutez et
                        créez des playlists selon vos envies !
                    </p>
                    <p className="font-semibold text-primaryBlue">
                        Connecte-toi et rejoins la communauté SoundWave dès
                        maintenant ! 🚀
                    </p>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center space-y-12">
                    <RegisterCard />
                    <LoginCard />
                </div>
                </div>
                
            </div>
        </>
    );
};

export default Auth;
