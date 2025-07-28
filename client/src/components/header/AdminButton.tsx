import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminButton: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdminRole = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedData = JSON.parse(storedUser);
                const userData = parsedData.user;
                
                if (userData && userData.roles && userData.roles.includes('ADMIN')) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
        };

        checkAdminRole();

        const handleStorageChange = () => {
            checkAdminRole();
        };

        window.addEventListener('storage', handleStorageChange);
        
        const interval = setInterval(checkAdminRole, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    if (!isAdmin) {
        return null;
    }

    return (
        <Link
            to="/admin"
            className="hover:opacity-80 transition-opacity"
            title="Panel Administrateur"
        >
            <svg
                width="28"
                height="24"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M14 2.4L22.4 6V10.8C22.4 16.32 18.76 21.36 14 22.8C9.24 21.36 5.6 16.32 5.6 10.8V6L14 2.4Z"
                    stroke="#93D9D6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M11.2 12L13.3 14.1L16.8 10.5"
                    stroke="#93D9D6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </Link>
    );
};

export default AdminButton;
