/**
 * @description Page d'accueil du site SoundWave pour les utilisateurs connectés
 * @author SoundWave
 */

import React from "react";
import Meta from "../components/utils/Meta";
import SearchBar from "../components/searchBar/SearchBar";
import Waves from "../components/waves/Waves";

const Home: React.FC = () => {
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
                    <Waves />
                </div>
            </div>
        </>
    );
};

export default Home;