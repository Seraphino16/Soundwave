/**
 * @description Blocs de connexion et d'inscription de SoundWave
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

export const LoginCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full md:w-[45%] text-center">
            <h2 className="text-3xl text-[#93D9D6] mb-6 mt-2">
                Déjà un compte ?
            </h2>
            <div className="flex flex-col items-center space-y-4">
                <button className="w-[80%] md:w-[60%] bg-[#F5F5F5]/75 py-2 rounded text-primaryBlue hover:bg-[#E0E0E0]/75 transition duration-200 cursor-pointer hover:text-[#93D9D6]">
                    CONNEXION
                </button>
                <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:space-x-6">
                    <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200 cursor-pointer">
                        <GoogleIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200 cursor-pointer">
                        <TwitterIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200 cursor-pointer">
                        <FacebookIcon />
                    </button>
                    <div className="col-span-3 flex justify-center lg:space-x-6 space-x-2">
                        <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200 cursor-pointer">
                            <SpotifyIcon />
                        </button>
                        <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200 cursor-pointer">
                            <DeezerIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RegisterCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full md:w-[45%] text-center">
            <h2 className="text-3xl text-[#93D9D6] mb-6 mt-2">Inscription</h2>
            <div className="flex flex-col items-center space-y-4">
                <button className="w-[80%] md:w-[60%] cursor-pointer bg-[#F5F5F5]/75 py-2 rounded text-primaryBlue hover:bg-[#E0E0E0]/75 transition duration-200 hover:text-[#93D9D6]">
                    CRÉER UN COMPTE
                </button>
                <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:space-x-6">
                    <button className="bg-[#F5F5F5]/75 p-2 rounded flex cursor-pointer items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200">
                        <GoogleIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded flex cursor-pointer items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200">
                        <TwitterIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded flex cursor-pointer items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200">
                        <FacebookIcon />
                    </button>
                    <div className="col-span-3 flex justify-center lg:space-x-6 space-x-2">
                        <button className="bg-[#F5F5F5]/75 p-2 rounded flex cursor-pointer items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200">
                            <SpotifyIcon />
                        </button>
                        <button className="bg-[#F5F5F5]/75 p-2 rounded flex cursor-pointer items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200">
                            <DeezerIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
