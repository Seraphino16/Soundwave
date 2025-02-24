/**
 * @description Barre de navigation du site, change selon la href="" route, le rôle et l'état de connexion de l'utilisateur
 */

import { useState } from "react";
import NavbarItem from "../utils/NavItem";
import "../../assets/styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed top-0 w-full flex justify-center">
            <nav className="w-full md:w-[95%] flex items-center justify-between py-4 px-6 lg:px-16 xl:px-48 font-inter shadow-md rounded-none md:rounded-b-xl">
                {" "}
                <div className="flex items-center space-x-8">
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
                    <a
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
                    </a>
                </div>
                <div className="hidden lg:flex space-x-6">
                    <a href="" className="hover:opacity-80 transition-opacity">
                        <svg
                            width="28"
                            height="24"
                            viewBox="0 0 28 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8.4 7.2H18.2M8.4 12H14M13.6348 16.5913L7.79135 21.6V16.5913H5.6C4.05365 16.5913 2.8 15.5168 2.8 14.1913V4.8C2.8 3.47454 4.05365 2.4 5.6 2.4H22.4C23.9464 2.4 25.2 3.47454 25.2 4.8V14.1913C25.2 15.5168 23.9464 16.5913 22.4 16.5913H13.6348Z"
                                stroke="#93D9D6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                    <a href="" className="hover:opacity-80 transition-opacity">
                        <svg
                            width="27"
                            height="24"
                            viewBox="0 0 27 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.9494 21.6L22.9498 18.0003C22.95 16.012 21.1367 14.4 18.8998 14.4H8.10063C5.86405 14.4 4.05088 16.0116 4.05063 17.9996L4.05017 21.6M17.5502 6C17.5502 7.98825 15.7369 9.6 13.5002 9.6C11.2634 9.6 9.45017 7.98825 9.45017 6C9.45017 4.0118 11.2634 2.4 13.5002 2.4C15.7369 2.4 17.5502 4.0118 17.5502 6Z"
                                stroke="#93D9D6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                    <a href="" className="hover:opacity-80 transition-opacity">
                        <svg
                            width="28"
                            height="24"
                            viewBox="0 0 28 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M15.9557 4.31627C15.4569 2.56124 12.5431 2.56124 12.0443 4.31627C11.9698 4.57999 11.8238 4.82492 11.618 5.03112C11.4123 5.23732 11.1526 5.39897 10.8602 5.50291C10.5678 5.60684 10.2509 5.65014 9.93524 5.62927C9.61962 5.60839 9.3142 5.52394 9.04384 5.38279C7.24304 4.44227 5.18235 6.20855 6.27963 7.75207C6.98841 8.74884 6.3597 10.0494 5.03666 10.325C2.98778 10.7514 2.98778 13.25 5.03666 13.6753C5.34442 13.7392 5.63022 13.8645 5.87079 14.041C6.11136 14.2175 6.2999 14.4402 6.42105 14.691C6.54219 14.9418 6.59253 15.2135 6.56796 15.4841C6.54338 15.7547 6.44459 16.0165 6.27963 16.2482C5.18235 17.7917 7.24304 19.558 9.04384 18.6175C9.31415 18.4761 9.61959 18.3914 9.9353 18.3704C10.251 18.3493 10.5681 18.3924 10.8606 18.4963C11.1532 18.6001 11.413 18.7617 11.619 18.9679C11.8249 19.1741 11.9711 19.4191 12.0456 19.6829C12.5431 21.439 15.4582 21.439 15.9544 19.6829C16.0292 19.4192 16.1755 19.1744 16.3815 18.9684C16.5874 18.7623 16.8472 18.6008 17.1397 18.497C17.4322 18.3932 17.7491 18.35 18.0648 18.3709C18.3804 18.3919 18.6858 18.4764 18.9562 18.6175C20.757 19.558 22.8177 17.7917 21.7204 16.2482C21.5557 16.0165 21.4571 15.7547 21.4327 15.4842C21.4083 15.2136 21.4587 14.942 21.5798 14.6913C21.7009 14.4406 21.8893 14.2179 22.1297 14.0414C22.3701 13.8648 22.6557 13.7394 22.9633 13.6753C25.0122 13.2489 25.0122 10.7502 22.9633 10.325C22.6556 10.2611 22.3698 10.1358 22.1292 9.95928C21.8886 9.78278 21.7001 9.56007 21.579 9.3093C21.4578 9.05853 21.4075 8.78677 21.432 8.51617C21.4566 8.24556 21.5554 7.98376 21.7204 7.75207C22.8177 6.20855 20.757 4.44227 18.9562 5.38279C18.6858 5.52418 18.3804 5.60886 18.0647 5.62992C17.749 5.65098 17.4319 5.60784 17.1394 5.504C16.8468 5.40016 16.587 5.23856 16.381 5.03236C16.1751 4.82616 16.0289 4.58119 15.9544 4.3174L15.9557 4.31627Z"
                                stroke="#93D9D6"
                                stroke-width="2"
                            />
                            <path
                                d="M16.3333 12C16.3333 13.1046 15.2887 14 14 14C12.7113 14 11.6667 13.1046 11.6667 12C11.6667 10.8954 12.7113 10 14 10C15.2887 10 16.3333 10.8954 16.3333 12Z"
                                stroke="#93D9D6"
                                stroke-width="2"
                            />
                        </svg>
                    </a>
                </div>
                {isOpen && (
                    <div className="absolute top-24 left-0 w-full bg-white shadow-md lg:hidden transition-all duration-300 ease-in-out overflow-hidden transform origin-top opacity-100 scale-y-100 max-h-[300px]">
                        <div className="flex flex-col items-center w-full py-4 space-y-4">
                            <NavbarItem text="ALBUMS" href="#" />
                            <NavbarItem text="ARTISTES" href="#" />
                            <NavbarItem text="EVENEMENTS" href="#" />

                            <div className="flex space-x-6 mt-4">
                                <a
                                    href=""
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    <svg
                                        width="28"
                                        height="24"
                                        viewBox="0 0 28 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8.4 7.2H18.2M8.4 12H14M13.6348 16.5913L7.79135 21.6V16.5913H5.6C4.05365 16.5913 2.8 15.5168 2.8 14.1913V4.8C2.8 3.47454 4.05365 2.4 5.6 2.4H22.4C23.9464 2.4 25.2 3.47454 25.2 4.8V14.1913C25.2 15.5168 23.9464 16.5913 22.4 16.5913H13.6348Z"
                                            stroke="#93D9D6"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </a>
                                <a
                                    href=""
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    <svg
                                        width="27"
                                        height="24"
                                        viewBox="0 0 27 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M22.9494 21.6L22.9498 18.0003C22.95 16.012 21.1367 14.4 18.8998 14.4H8.10063C5.86405 14.4 4.05088 16.0116 4.05063 17.9996L4.05017 21.6M17.5502 6C17.5502 7.98825 15.7369 9.6 13.5002 9.6C11.2634 9.6 9.45017 7.98825 9.45017 6C9.45017 4.0118 11.2634 2.4 13.5002 2.4C15.7369 2.4 17.5502 4.0118 17.5502 6Z"
                                            stroke="#93D9D6"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </a>
                                <a
                                    href=""
                                    className="hover:opacity-80 transition-opacity"
                                >
                                    <svg
                                        width="28"
                                        height="24"
                                        viewBox="0 0 28 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M15.9557 4.31627C15.4569 2.56124 12.5431 2.56124 12.0443 4.31627C11.9698 4.57999 11.8238 4.82492 11.618 5.03112C11.4123 5.23732 11.1526 5.39897 10.8602 5.50291C10.5678 5.60684 10.2509 5.65014 9.93524 5.62927C9.61962 5.60839 9.3142 5.52394 9.04384 5.38279C7.24304 4.44227 5.18235 6.20855 6.27963 7.75207C6.98841 8.74884 6.3597 10.0494 5.03666 10.325C2.98778 10.7514 2.98778 13.25 5.03666 13.6753C5.34442 13.7392 5.63022 13.8645 5.87079 14.041C6.11136 14.2175 6.2999 14.4402 6.42105 14.691C6.54219 14.9418 6.59253 15.2135 6.56796 15.4841C6.54338 15.7547 6.44459 16.0165 6.27963 16.2482C5.18235 17.7917 7.24304 19.558 9.04384 18.6175C9.31415 18.4761 9.61959 18.3914 9.9353 18.3704C10.251 18.3493 10.5681 18.3924 10.8606 18.4963C11.1532 18.6001 11.413 18.7617 11.619 18.9679C11.8249 19.1741 11.9711 19.4191 12.0456 19.6829C12.5431 21.439 15.4582 21.439 15.9544 19.6829C16.0292 19.4192 16.1755 19.1744 16.3815 18.9684C16.5874 18.7623 16.8472 18.6008 17.1397 18.497C17.4322 18.3932 17.7491 18.35 18.0648 18.3709C18.3804 18.3919 18.6858 18.4764 18.9562 18.6175C20.757 19.558 22.8177 17.7917 21.7204 16.2482C21.5557 16.0165 21.4571 15.7547 21.4327 15.4842C21.4083 15.2136 21.4587 14.942 21.5798 14.6913C21.7009 14.4406 21.8893 14.2179 22.1297 14.0414C22.3701 13.8648 22.6557 13.7394 22.9633 13.6753C25.0122 13.2489 25.0122 10.7502 22.9633 10.325C22.6556 10.2611 22.3698 10.1358 22.1292 9.95928C21.8886 9.78278 21.7001 9.56007 21.579 9.3093C21.4578 9.05853 21.4075 8.78677 21.432 8.51617C21.4566 8.24556 21.5554 7.98376 21.7204 7.75207C22.8177 6.20855 20.757 4.44227 18.9562 5.38279C18.6858 5.52418 18.3804 5.60886 18.0647 5.62992C17.749 5.65098 17.4319 5.60784 17.1394 5.504C16.8468 5.40016 16.587 5.23856 16.381 5.03236C16.1751 4.82616 16.0289 4.58119 15.9544 4.3174L15.9557 4.31627Z"
                                            stroke="#93D9D6"
                                            stroke-width="2"
                                        />
                                        <path
                                            d="M16.3333 12C16.3333 13.1046 15.2887 14 14 14C12.7113 14 11.6667 13.1046 11.6667 12C11.6667 10.8954 12.7113 10 14 10C15.2887 10 16.3333 10.8954 16.3333 12Z"
                                            stroke="#93D9D6"
                                            stroke-width="2"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
