/**
 * @description Page d'acceuil du site SoundWave
 * @author SoundWave
 * */

import React from "react";
import Meta from "../components/utils/Meta";

const Home: React.FC = () => {
    return (
        <>
            <Meta
                title="Accueil"
                description="Page d'accueil du site SoundWave"
                // Rajouter la canonical URL quand il y en aura une (valable pour toutes les pages)
            />
        </>
    );
};

export default Home;
