/**
 * @description Page d'accueil du site SoundWave pour les utilisateurs non connectés
 * @author SoundWave
 * */

import React from "react";
import { Link } from "react-router-dom";
import Meta from "../components/utils/Meta";

const HomePageGuest: React.FC = () => {
  return (
    <>
    <Meta
                title="Soundwave - Accueil"
                description="Page d'accueil du site SoundWave"
            />
    <div className="min-h-screen w-full flex flex-col items-center justify-start relative">
      <div className="absolute top-0 left-0 w-full h-[70vh] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: "url('/background.jpg')" }}>
        <div className="relative max-w-4xl text-center bg-white p-12 rounded-xl shadow-lg border border-gray-300 bg-opacity-95">
          <h1 className="text-4xl font-bold text-primaryBlue mb-6">Bienvenue sur SoundWave</h1>
          <p className="text-lg text-text-200 mb-6">
            Découvrez et partagez votre passion pour la musique avec la communauté SoundWave.
            Rejoignez-nous pour explorer les dernières tendances musicales, suivre vos artistes préférés et partager vos propres découvertes.
          </p>
          <div className="flex space-x-6 justify-center">
            <Link to="/auth" className="bg-primaryBlue text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#B0C7E6] transition text-center">
              S'inscrire
            </Link>
            <Link to="/auth" className="bg-primaryBlue text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#B0C7E6] transition text-center">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePageGuest;
