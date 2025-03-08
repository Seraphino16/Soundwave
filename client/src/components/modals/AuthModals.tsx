/**
 * @description Modales pour les formulaires d'inscription et de connexion du site SoundWave
 * @author SoundWave
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalsProps {
    isOpen: boolean;
    onClose: () => void;
    type: "login" | "register";
}

const AuthModals: React.FC<AuthModalsProps> = ({ isOpen, onClose, type }) => {
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 0.5 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
    };

    const [birthDate, setBirthDate] = useState<string>("");
    const isUnderage = () => {
        const now = new Date();
        const birth = new Date(birthDate);
        const age = now.getFullYear() - birth.getFullYear();
        return age < 18;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="bg-white w-[90%] md:w-[60%] lg:w-[40%] xl:w-[30%] p-6 rounded-2xl shadow-lg relative">
                            <button
                                className="absolute text-3xl top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-700"
                                onClick={onClose}
                            >
                                ✕
                            </button>

                            {type === "login" ? (
                                <>
                                    <h2 className="text-2xl text-[#93D9D6] mb-6 mt-2 text-center">
                                        Déjà un compte ? Connectez-vous !
                                    </h2>
                                    <form className="flex flex-col space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Email ou Nom d'utilisateur"
                                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#93D9D6]"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Mot de passe"
                                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#93D9D6]"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[#93D9D6] text-white cursor-pointer py-2 rounded-md hover:bg-[#78b7b4] transition duration-200"
                                        >
                                            Se connecter
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl text-[#93D9D6] mb-6 mt-2 text-center">
                                        Pas de compte ? Inscrivez-vous !
                                    </h2>
                                    <form className="flex flex-col space-y-4">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#93D9D6]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Nom d'utilisateur"
                                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#93D9D6]"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Pseudo affiché"
                                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#93D9D6]"
                                        />
                                        <input
                                            type="date"
                                            placeholder="Date de naissance"
                                            value={birthDate}
                                            onChange={(e) =>
                                                setBirthDate(e.target.value)
                                            }
                                            className={`border rounded-md p-2 focus:outline-none focus:ring-2 ${
                                                isUnderage()
                                                    ? "focus:ring-red-500 border-red-500"
                                                    : "focus:ring-[#93D9D6]"
                                            }`}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Mot de passe"
                                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#93D9D6]"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirmer le mot de passe"
                                            className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#93D9D6]"
                                        />
                                        <button
                                            type="submit"
                                            className={`py-2 rounded-md text-white transition cursor-pointer duration-200 ${
                                                isUnderage()
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-[#93D9D6] hover:bg-[#78b7b4]"
                                            }`}
                                            disabled={isUnderage()}
                                        >
                                            S'inscrire
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AuthModals;