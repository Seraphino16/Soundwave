/**
 * @description Page d'authentification du site SoundWave
 * @author SoundWave
 * */

import React from "react";
import Meta from "../components/utils/Meta";

const Auth: React.FC = () => {
    return (
        <>
            <Meta
                title="Authentification Page"
                description="Page d'authentification du site SoundWave"
                // Rajouter la canonical URL quand il y en aura une (valable pour toutes les pages)
            />

            <div className="flex items-center justify-center min-h-screen">
                <div className="w-[80%] bg-white/60 rounded-2xl p-8 shadow-lg flex flex-col items-center justify-center text-primaryBlue">
                    <h1 className="text-2xl font-bold mb-4 text-center">
                        Bienvenue sur SoundWave 🎵
                    </h1>
                    <p className="mb-2 text-center">
                        SoundWave est le réseau social ultime pour tous les
                        passionnés de musique. Échangez avec d'autres mélomanes,
                        partagez vos coups de cœur et découvrez de nouveaux
                        sons.
                    </p>
                    <p className="mb-2 text-center">
                        Retrouvez une collection complète d'albums, d'artistes
                        et de morceaux classés avec soin. Explorez, écoutez et
                        créez des playlists selon vos envies !
                    </p>
                    <p className="font-semibold text-primaryBlue text-center">
                        Connecte-toi et rejoins la communauté SoundWave dès
                        maintenant ! 🚀
                    </p>
                </div>
            </div>
        </>
    );
};

export default Auth;
