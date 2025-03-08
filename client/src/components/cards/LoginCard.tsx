/**
 * @description Bloc de connexion de SoundWave
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

const LoginCard: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg w-full md:w-[45%] text-center">
            <h2 className="text-3xl text-[#93D9D6] mb-6 mt-2">
                Déjà un compte ?
            </h2>
            <div className="flex flex-col items-center space-y-4">
                <button className="w-[80%] md:w-[60%] bg-[#F5F5F5]/75 py-2 rounded text-primaryBlue">
                    CONNEXION
                </button>
                <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:space-x-6">
                    <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center">
                        <GoogleIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center">
                        <TwitterIcon />
                    </button>
                    <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center">
                        <FacebookIcon />
                    </button>
                    <div className="col-span-3 flex justify-center space-x-2">
                        <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center">
                            <SpotifyIcon />
                        </button>
                        <button className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center">
                            <DeezerIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCard;
