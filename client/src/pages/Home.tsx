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
            
            <div className="relative mt-28 md:ml-10 lg:ml-12">
                <div className="hidden md:block w-[20%]">
                    <SearchBar />
                </div>
            </div>
        </>
    );
};

export default Home;
