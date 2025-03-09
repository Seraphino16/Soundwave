/**
 * @description Page d'accueil du site SoundWave
 * @author SoundWave
 */

import React from "react";
import Meta from "../components/utils/Meta";
import SearchBar from "../components/searchBar/SearchBar";
import Waves from "../components/waves/Waves"; // Import the Waves component

const Home: React.FC = () => {
    return (
        <>
            <Meta
                title="Accueil"
                description="Page d'accueil du site SoundWave"
            />

            <div className="relative md:ml-10 lg:ml-12">
                {/* Barre de recherche */}

                <div className="hidden md:block w-[20%]">
                    <SearchBar />
                </div>

                {/* Waves Section (Center) */}
                <div className="flex-1 max-w-2xl mx-auto p-4">
                    <Waves />
                </div>
            </div>
        </>
    );
};

export default Home;