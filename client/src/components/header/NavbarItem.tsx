/**
 * @description Élément textuel de la barre de navigation
 * @param {string} text - Texte à afficher dans l'élément de navigation
 * @param {string} href - URL vers laquelle l'élément de navigation pointe
 * @param {function} [onClick] - Fonction à appeler lors du clic sur l'élément de navigation
 * @param {JSX.Element} [icon] - Icône à afficher à côté du texte
 */

import { JSX } from 'react';
import { Link } from 'react-router-dom';
import "../../assets/styles/Navbar.css";

interface NavbarItemProps {
    text: string;
    href: string;
    onClick?: () => void;
    icon?: JSX.Element;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ text, href, onClick, icon }) => {
    return (
        <Link
            to={href}
            onClick={onClick}
            className="flex items-center justify-center px-4 py-2 text-lg rounded-lg text-primaryBlue transition-colors duration-200 ease-in-out hover:underline underline-offset-8 dark:bg-transparent dark:text-primaryBlue"
        >
            {icon && <span className="mr-2">{icon}</span>}
            {text}
        </Link>
    );
}

export default NavbarItem;