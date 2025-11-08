/**
 * @description Barre de navigation du site SoundWave avec gestion utilisateur via UserContext
 * @autor SoundWave
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarItem from "../utils/NavItem";
import "../../assets/styles/Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import SearchBar from "../searchBar/SearchBar";
import {MessagesIcon, ProfileIcon, SettingsIcon, BurgerMenuIcon, LogoutIcon} from "../utils/Icons";
import AdminButton from "./AdminButton";
import { useUserContext } from "../../context/UserContext";

interface NavItem {
    text: string;
    href: string;
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading, logout } = useUserContext();
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        closeMenu();
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/auth");
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            navigate("/auth");
        }
    };

    const navItems: NavItem[] = [
        { text: "ALBUMS", href: "/albums" },
        { text: "ARTISTES", href: "/artists" },
        { text: "EVENEMENTS", href: "/events" },
    ];

    const isAuthRoute = location.pathname.startsWith("/auth");
    const isGuestPage = location.pathname === "/";

    const mockUser = {
        _id: "1",
        id: 1,
        pseudo: "Alex Martin",
        username: "music_lover_2024",
        email: "alex@example.com",
        birthdate: "1990-01-01",
        roles: ["user"],
        is_verified: true,
        is_active: true,
        createdAt: "2023-03-15T10:00:00Z",
        updatedAt: "2024-08-01T12:00:00Z",
        verification_token: "",
    };

    const effectiveUser = user || mockUser;
    const shouldShowUserInfo = !loading && effectiveUser;

    return (
        <div className="fixed top-0 w-full flex justify-center z-10">
            <nav className="w-full lg:w-[95%] flex items-center bg-white justify-between py-4 xl:px-4 font-inter shadow-md lg:rounded-b-xl z-10">
                {/* === LOGO === */}
                <div className="flex items-center space-x-2">
                    <Link to={effectiveUser ? "/home" : "/"}>
                        <img src={logo} alt="Logo" className="w-16 h-16" />
                    </Link>
                    <span className="text-2xl md:text-3xl lg:text-4xl mt-6 hover:text-text-200 font-site-name text-primaryBlue">
            SoundWave
          </span>
                </div>

                {/* === INVITÉ (non connecté) === */}
                {isGuestPage ? (
                    <div className="hidden lg:flex space-x-6 items-center">
                        <Link
                            to="/auth"
                            className="bg-primaryBlue text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#B0C7E6] transition"
                        >
                            S'inscrire
                        </Link>
                        <Link
                            to="/auth"
                            className="bg-white text-primaryBlue border border-primaryBlue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Se connecter
                        </Link>
                    </div>
                ) : (
                    !isAuthRoute && (
                        <div className="hidden lg:flex space-x-6">
                            {navItems.map((item) => (
                                <NavbarItem key={item.href} text={item.text} href={item.href} />
                            ))}
                        </div>
                    )
                )}

                {/* === UTILISATEUR CONNECTÉ (Desktop) === */}
                {!isAuthRoute && !isGuestPage && (
                    <div className="hidden lg:flex space-x-6 mx-2 items-center">
                        <button className="hover:opacity-80 transition-opacity">
                            <MessagesIcon />
                        </button>
                        <Link to="/profile" className="hover:opacity-80 transition-opacity" title="Mon profil">
                            <ProfileIcon />
                        </Link>
                        <Link to="/settings?tab=settings" className="hover:opacity-80 transition-opacity">
                            <SettingsIcon />
                        </Link>
                        <AdminButton />
                        {shouldShowUserInfo && (
                            <div className="flex flex-col items-end">
                                <span className="text-lg font-semibold">{effectiveUser.pseudo}</span>
                                <span className="text-sm text-gray-500">@{effectiveUser.username}</span>
                            </div>
                        )}
                        {shouldShowUserInfo && (
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 transition-colors"
                                title="Déconnexion"
                            >
                                <LogoutIcon />
                            </button>
                        )}
                    </div>
                )}

                {/* === MENU MOBILE === */}
                <div className="block lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className="p-2 border mr-4 rounded text-gray-700 border-gray-700 hover:text-text-200 hover:border-text-200"
                    >
                        <BurgerMenuIcon />
                    </button>
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed top-24 left-0 w-full h-[calc(100vh-6rem)] bg-black/50 z-40"
                                onClick={closeMenu}
                            />
                            <motion.div
                                initial={{ y: "-100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "-100%", opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="absolute top-24 left-0 w-full bg-white shadow-md lg:hidden transition-all ease-in-out overflow-hidden z-50"
                            >
                                <div className="flex flex-col items-center w-full py-4 space-y-4">
                                    {!isAuthRoute && !isGuestPage && (
                                        <>
                                            {navItems.map((item) => (
                                                <NavbarItem key={item.href} text={item.text} href={item.href} />
                                            ))}
                                        </>
                                    )}


                                    {shouldShowUserInfo && (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="flex space-x-6">
                                                <button className="hover:opacity-80 transition-opacity">
                                                    <MessagesIcon />
                                                </button>
                                                <Link to="/profile" className="hover:opacity-80 transition-opacity">
                                                    <ProfileIcon />
                                                </Link>
                                                <Link to="/settings" className="hover:opacity-80 transition-opacity">
                                                    <SettingsIcon />
                                                </Link>
                                                <AdminButton />
                                            </div>

                                            <div className="flex flex-col items-center">
                                                <span className="text-lg font-semibold">{effectiveUser.pseudo}</span>
                                                <span className="text-sm text-gray-500">@{effectiveUser.username}</span>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="text-red-500 hover:text-red-600 transition-colors"
                                                    title="Déconnexion"
                                                >
                                                    <LogoutIcon />
                                                </button>
                                            </div>
                                        </div>
                                    )}


                                    <SearchBar />

                                    {isGuestPage && (
                                        <>
                                            <Link
                                                to="/auth"
                                                className="bg-primaryBlue text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#B0C7E6] transition text-center"
                                            >
                                                S'inscrire
                                            </Link>
                                            <Link
                                                to="/auth"
                                                className="bg-white text-primaryBlue border border-primaryBlue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-center"
                                            >
                                                Se connecter
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
        </div>
    );
};

export default Navbar;
