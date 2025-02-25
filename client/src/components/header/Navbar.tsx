/**
 * @description Barre de navigation du site, change selon la href="" route, le rôle et l'état de connexion de l'utilisateur
 * @author SoundWave
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarItem from "../utils/NavItem";
import "../../assets/styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import SearchBar from "../searchBar/SearchBar";
import { MessagesIcon, ProfileIcon, SettingsIcon, BurgerMenuIcon } from "../utils/Icons";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <div className="fixed top-0 w-full flex justify-center z-50">
            <nav className="w-full md:w-[95%] flex items-center bg-white justify-between py-4 xl:px-4 font-inter shadow-md md:rounded-b-xl z-50">
                <div className="flex items-center space-x-2">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-16 h-16" />
                    </Link>
                    <span className="text-2xl md:text-3xl lg:text-4xl mt-6 hover:text-text-200 font-site-name text-primaryBlue">
                        SoundWave
                    </span>
                </div>
                <div className="hidden lg:flex space-x-6">
                    <NavbarItem text="ALBUMS" href="#" />
                    <NavbarItem text="ARTISTES" href="#" />
                    <NavbarItem text="EVENEMENTS" href="#" />
                </div>
                <div className="block lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className="p-2 border mr-4 rounded text-gray-700 border-gray-700 hover:text-text-200 hover:border-text-200"
                    >
                        <BurgerMenuIcon />
                    </button>
                </div>
                <div className="hidden lg:flex space-x-6">
                    <a href="#" className="hover:opacity-80 transition-opacity">
                        <MessagesIcon />
                    </a>
                    <a href="#" className="hover:opacity-80 transition-opacity">
                        <ProfileIcon />
                    </a>
                    <a href="#" className="hover:opacity-80 transition-opacity">
                        <SettingsIcon />
                    </a>
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
                                    <NavbarItem text="ALBUMS" href="#" />
                                    <NavbarItem text="ARTISTES" href="#" />
                                    <NavbarItem text="EVENEMENTS" href="#" />
                                    <div className="flex space-x-6 mt-4">
                                        <a href="#" className="hover:opacity-80 transition-opacity">
                                            <MessagesIcon />
                                        </a>
                                        <a href="#" className="hover:opacity-80 transition-opacity">
                                            <ProfileIcon />
                                        </a>
                                        <a href="#" className="hover:opacity-80 transition-opacity">
                                            <SettingsIcon />
                                        </a>
                                    </div>
                                    <SearchBar />
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
