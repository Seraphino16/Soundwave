import React, { JSX } from 'react';
import { Link } from 'react-router-dom';
import "../../assets/styles/Navbar.css";

interface NavItemProps {
    text: string;
    href: string;
    onClick?: () => void;
    icon?: JSX.Element;
}

const NavItem: React.FC<NavItemProps> = ({ text, href, onClick, icon }) => {
    return (
        <Link
            to={href}
            onClick={onClick}
            className="flex items-center justify-center px-4 py-2 text-lg rounded-lg text-primaryBlue transition-colors duration-200 ease-in-out underline lg:no-underline lg:hover:underline underline-offset-8 dark:bg-transparent dark:text-primaryBlue"
        >
            {icon && <span className="mr-2">{icon}</span>}
            {text}
        </Link>
    );
}

export default NavItem;