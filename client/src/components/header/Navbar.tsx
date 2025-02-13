/**
 * @description Barre de navigation du site, change selon la route, le rôle et l'état de connexion de l'utilisateur
 */

import { useState } from "react";
import NavbarItem from "./NavbarItem";
import "../../assets/styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="fixed top-0 w-full flex items-center justify-between bg-bg-100 py-4 shadow-md px-6 lg:px-16 xl:px-48 font-inter">
            <div className="flex items-center flex-shrink-0 space-x-0">
                <Link to="/">
                    <img src={logo} alt="Logo" className="w-16 h-16" />
                </Link>
                <span className="text-2xl md:text-3xl lg:text-4xl hover:text-text-200 font-site-name text-[#93AFD9]">
                    SoundWave
                </span>
            </div>

            <div className="block lg:hidden">
                <button
                    onClick={toggleMenu}
                    className="flex items-center px-3 py-2 border rounded text-gray-700 border-gray-700 hover:text-text-200 hover:border-text-200"
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

            <div className="hidden lg:flex flex-grow justify-center w-full">
                <div className="flex space-x-6">
                    <NavbarItem text="Albums" href="#" />
                    <NavbarItem text="Artistes" href="#" />
                    <NavbarItem text="Evènements" href="#" />
                </div>
            </div>

            <div
                className={`absolute top-24 left-0 w-full bg-white shadow-md lg:hidden transition-all duration-300 ease-in-out overflow-hidden transform origin-top 
                ${isOpen ? "opacity-100 scale-y-100 max-h-[300px]" : "opacity-0 scale-y-0 max-h-0"}`}
            >
                <div className="flex flex-col items-center w-full py-4 space-y-4">
                    <NavbarItem text="Albums" href="#" />
                    <NavbarItem text="Artistes" href="#" />
                    <NavbarItem text="Evènements" href="#" />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
