/**
 * @description Bloc d'inscription de SoundWave
 * @author SoundWave
 */

import React from "react";
import {
    GoogleIcon,
    TwitterIcon,
    FacebookIcon,
    SpotifyIcon,
    DeezerIcon,
} from "../utils/Icons";

const RegisterCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full md:w-[45%] text-center">
            <h2 className="text-3xl text-[#93D9D6] mb-6 mt-2">Inscription</h2>
            <div className="flex flex-col items-center space-y-4">
                <button className="w-[60%] bg-[#F5F5F5]/75 py-2 rounded text-primaryBlue">
                    CRÉER UN COMPTE
                </button>
                <div className="flex justify-center space-x-6">
                    <button className="bg-[#F5F5F5]/75 p-2 rounded">
                        <GoogleIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded">
                        <TwitterIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded">
                        <FacebookIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded">
                        <SpotifyIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded">
                        <DeezerIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterCard;
