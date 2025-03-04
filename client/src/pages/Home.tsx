/**
 * @description Page d'accueil du site SoundWave
 * @author SoundWave
 */

import React from "react";
import Meta from "../components/utils/Meta";
import SearchBar from "../components/searchBar/SearchBar";

const Home: React.FC = () => {
    return (
        <>
            <Meta
                title="Accueil"
                description="Page d'accueil du site SoundWave"
            />

            <div className="relative mt-28 md:ml-10 lg:ml-12">
                {/* Barre de recherche */}
                <div className="hidden md:block w-[20%]">
                    <SearchBar />
                </div>
            </div>
        </>
    );
};

export default Home;