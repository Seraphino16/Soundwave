import React, { useState, useEffect } from "react";
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
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isUnderage = () => {
        const now = new Date();
        const birth = new Date(birthDate);
        const age = now.getFullYear() - birth.getFullYear();
        return age < 13;
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (type === "register") {
            if (!/\S+@\S+\.\S+/.test(email))
                newErrors.email = "Email invalide.";
            if (username.length < 3)
                newErrors.username = "Nom d'utilisateur trop court.";
            if (!displayName) newErrors.displayName = "Pseudo affiché requis.";
            if (!birthDate) newErrors.birthDate = "Date de naissance requise.";
            if (isUnderage())
                newErrors.birthDate = "Vous devez avoir au moins 13 ans.";
            if (password.length < 6)
                newErrors.password = "Mot de passe trop court.";
            if (password !== confirmPassword)
                newErrors.confirmPassword =
                    "Les mots de passe ne correspondent pas.";
        } else {
            if (!email) newErrors.email = "Email ou Nom d'utilisateur requis.";
            if (!password) newErrors.password = "Mot de passe requis.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        validateForm();
    }, [email, username, displayName, birthDate, password, confirmPassword]);

    const isFormValid =
        Object.keys(errors).length === 0 &&
        ((type === "register" &&
            email &&
            username &&
            displayName &&
            birthDate &&
            password &&
            confirmPassword) ||
            (type === "login" && email && password));

    const getFirstError = () => {
        if (errors.email) return errors.email;
        if (errors.username) return errors.username;
        if (errors.displayName) return errors.displayName;
        if (errors.birthDate) return errors.birthDate;
        if (errors.password) return errors.password;
        if (errors.confirmPassword) return errors.confirmPassword;
        return null;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
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
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="bg-white w-[90%] md:w-[60%] lg:w-[40%] xl:w-[30%] p-6 rounded-2xl shadow-lg relative"
                            onClick={(e) => e.stopPropagation()}
                        >
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
                                            type="email"
                                            placeholder="Email ou Nom d'utilisateur"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className={`border rounded-md p-2 focus:outline-none focus:ring-2 ${
                                                errors.email
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "focus:ring-[#93D9D6]"
                                            }`}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Mot de passe"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className={`border rounded-md p-2 ${
                                                errors.password
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                        <button
                                            type="submit"
                                            className={`py-2 rounded-md text-white transition duration-200 ${
                                                isFormValid
                                                    ? "bg-[#93D9D6] hover:bg-[#78b7b4]"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                            disabled={!isFormValid}
                                        >
                                            Se connecter
                                        </button>
                                        {getFirstError() && (
                                            <span className="text-red-500 text-sm">
                                                {getFirstError()}
                                            </span>
                                        )}
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
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className={`border rounded-md p-2 focus:outline-none focus:ring-2 ${
                                                errors.email
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "focus:ring-[#93D9D6]"
                                            }`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Nom d'utilisateur"
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            className={`border rounded-md p-2 ${
                                                errors.username
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Pseudo affiché"
                                            value={displayName}
                                            onChange={(e) =>
                                                setDisplayName(e.target.value)
                                            }
                                            className={`border rounded-md p-2 ${
                                                errors.displayName
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                        <input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) =>
                                                setBirthDate(e.target.value)
                                            }
                                            className={`border rounded-md p-2 ${
                                                errors.birthDate
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Mot de passe"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className={`border rounded-md p-2 ${
                                                errors.password
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirmer le mot de passe"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            className={`border rounded-md p-2 ${
                                                errors.confirmPassword
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        />
                                        <button
                                            type="submit"
                                            className={`py-2 rounded-md text-white transition duration-200 ${
                                                isFormValid
                                                    ? "bg-[#93D9D6] hover:bg-[#78b7b4]"
                                                    : "bg-gray-400 cursor-not-allowed"
                                            }`}
                                            disabled={!isFormValid}
                                        >
                                            S'inscrire
                                        </button>
                                        {getFirstError() && (
                                            <span className="text-red-500 text-sm">
                                                {getFirstError()}
                                            </span>
                                        )}
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