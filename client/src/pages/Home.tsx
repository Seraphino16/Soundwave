/**
 * @description Page d'acceuil du site SoundWave
 * @author SoundWave
 * */

import React from "react";
import Meta from "../components/utils/Meta";
import SearchBar from "../components/searchBar/SearchBar";

const Home: React.FC = () => {
    return (
        <>
            <Meta
                title="Accueil"
                description="Page d'accueil du site SoundWave"
                // Rajouter la canonical URL quand il y en aura une (valable pour toutes les pages)
            />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold text-center mb-8">Bienvenue sur SoundWave</h1>
                <SearchBar />
            </div>
        </>
    );
};

export default Home;
