import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarItem from "../utils/NavItem";
import "../../assets/styles/Navbar.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { BurgerMenuIcon } from "../utils/Icons";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);
    const location = useLocation();

    useEffect(() => {
        closeMenu();
    }, [location]);

    const isGuestPage = location.pathname === "/";

    return (
        <div className="fixed top-0 w-full flex justify-center z-10">
            <nav className="w-full lg:w-[95%] flex items-center bg-white justify-between py-4 xl:px-4 font-inter shadow-md lg:rounded-b-xl z-10">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="w-16 h-16" />
                    </Link>
                    <span className="text-2xl md:text-3xl lg:text-4xl mt-6 hover:text-text-200 font-site-name text-primaryBlue">
                        SoundWave
                    </span>
                </div>

                {/* If on the guest homepage, show "Sign Up" and "Login" */}
                {isGuestPage ? (
                    <div className="hidden lg:flex space-x-6 items-center">
                        <Link
                            to="/signup"
                            className="bg-primaryBlue text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#B0C7E6] transition"
                        >
                            S'inscrire
                        </Link>
                        <Link
                            to="/login"
                            className="bg-white text-primaryBlue border border-primaryBlue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Se connecter
                        </Link>
                    </div>
                ) : (
                    <div className="hidden lg:flex space-x-6">
                        <NavbarItem text="ALBUMS" href="/albums" />
                        <NavbarItem text="ARTISTES" href="/artists" />
                        <NavbarItem text="EVENEMENTS" href="/events" />
                    </div>
                )}

                {/* Mobile Menu */}
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
                                    {isGuestPage ? (
                                        <>
                                            <Link
                                                to="/signup"
                                                className="bg-primaryBlue text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#B0C7E6] transition text-center"
                                            >
                                                S'inscrire
                                            </Link>
                                            <Link
                                                to="/login"
                                                className="bg-white text-primaryBlue border border-primaryBlue px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-center"
                                            >
                                                Se connecter
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <NavbarItem text="ALBUMS" href="/albums" />
                                            <NavbarItem text="ARTISTES" href="/artists" />
                                            <NavbarItem text="EVENEMENTS" href="/events" />
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
