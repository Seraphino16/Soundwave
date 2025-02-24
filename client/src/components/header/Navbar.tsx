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
import MessagesIcon from "../icons/MessagesIcon";
import ProfileIcon from "../icons/ProfileIcon";
import SettingsIcon from "../icons/SettingsIcon";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="fixed top-0 w-full flex justify-center">
            <nav className="w-full md:w-[95%] flex items-center bg-white justify-between py-4 xl:px-4 font-inter shadow-md md:rounded-b-xl">
                <div className="flex items-center space-x-2">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-16 h-16" />
                    </Link>
                    <span className="text-2xl md:text-3xl lg:text-4xl hover:text-text-200 font-site-name text-primaryBlue">
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
                        <svg
                            className="fill-current h-5 w-5"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
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
                        <motion.div
                            initial={{ y: "-100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="absolute top-24 left-0 w-full bg-white shadow-md lg:hidden transition-all ease-in-out overflow-hidden"
                        >
                            <div className="flex flex-col items-center w-full py-4 space-y-4">
                                <NavbarItem text="ALBUMS" href="#" />
                                <NavbarItem text="ARTISTES" href="#" />
                                <NavbarItem text="EVENEMENTS" href="#" />
                                <div className="flex space-x-6 mt-4">
                                    <a
                                        href="#"
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <MessagesIcon />
                                    </a>
                                    <a
                                        href="#"
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <ProfileIcon />
                                    </a>
                                    <a
                                        href="#"
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <SettingsIcon />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </div>
    );
};

export default Navbar;
