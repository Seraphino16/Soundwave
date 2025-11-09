import React, { useState } from "react";
import AuthModals from "../modals/AuthModals";
import { SpotifyIcon } from "../utils/Icons";
import { useNavigate } from "react-router-dom";

import { API_URL } from '../../config/api';

const getSpotifyAuthUrl = async (isLogin: boolean) => {
  try {
    let response;
    if (isLogin) {
      response = await fetch(`${API_URL}/auth/spotify`);
    } else {
      response = await fetch(`${API_URL}/users/create/spotify`);
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'URL Spotify:", error);
    throw error;
  }
};

export const LoginCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("login");

  const openLoginModal = () => {
    setModalType("login");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSpotifyLogin = async () => {
    try {
      const authUrl = await getSpotifyAuthUrl(true);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Erreur lors de la redirection vers Spotify:", error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-lg w-full md:w-[45%] text-center">
        <h2 className="text-3xl text-[#93D9D6] mb-6 mt-2">Déjà un compte ?</h2>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={openLoginModal}
            className="w-[80%] md:w-[60%] bg-[#F5F5F5]/75 py-2 rounded text-primaryBlue hover:bg-[#E0E0E0]/75 transition duration-200 cursor-pointer hover:text-[#93D9D6]"
          >
            CONNEXION
          </button>
          <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:space-x-6">
            <button
              onClick={handleSpotifyLogin}
              className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200 cursor-pointer"
            >
              <SpotifyIcon />
            </button>
          </div>
        </div>
      </div>
      <AuthModals isOpen={isModalOpen && modalType === "login"} onClose={closeModal} type="login" />
    </>
  );
};

export const RegisterCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register">("register");

  const openRegisterModal = () => {
    setModalType("register");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const navigate = useNavigate();

  const handleSpotifyRegister = async () => {
    try {
      const authUrl = await getSpotifyAuthUrl(false);
      window.location.href = authUrl;
    } catch (error: any) {
      if (error.message === "L'email existe déjà" || error.message?.includes("email existe déjà")) {
        navigate("/error-email-already-exists");
      } else {
        alert(error.message || "Erreur lors de l'inscription.");
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-lg w-full md:w-[45%] text-center">
        <h2 className="text-3xl text-[#93D9D6] mb-6 mt-2">Inscription</h2>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={openRegisterModal}
            className="w-[80%] md:w-[60%] cursor-pointer bg-[#F5F5F5]/75 py-2 rounded text-primaryBlue hover:bg-[#E0E0E0]/75 transition duration-200 hover:text-[#93D9D6]"
          >
            CRÉER UN COMPTE
          </button>
          <div className="grid grid-cols-3 gap-2 md:flex md:justify-center md:space-x-6">
             <button
              onClick={handleSpotifyRegister}
              className="bg-[#F5F5F5]/75 p-2 rounded flex items-center justify-center hover:bg-[#E0E0E0]/75 transition duration-200 cursor-pointer"
            >
              <SpotifyIcon />
            </button>
          </div>
        </div>
      </div>
      <AuthModals isOpen={isModalOpen && modalType === "register"} onClose={closeModal} type="register" />
    </>
  );
};
