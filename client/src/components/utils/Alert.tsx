/**
 * @description Pop up apparaîssant en bas à droite de la fenêtre afin d'afficher des messages d'alerte.
 * @author SoundWave
 * @param {string} type - Types des messages (error, warning, info, success).
 * @param {string} title - Titre du message
 * @param {string} message - Message à afficher
 * @param {function} onClose - Fonction pour fermer l'alerte
 * */

import React from 'react';
import "../../assets/styles/App.css";

interface AlertProps {
    id: number;
    type: "error" | "warning" | "info" | "success";
    title: string;
    message: string;
    onClose: (id: number) => void;
}

const Alert: React.FC<AlertProps> = ({ id, type, title, message, onClose }) => {
    if (!message) return null;

    const alertClass =
        type === "success"
            ? "bg-green-100 text-green-800"
            : type === "error"
            ? "bg-red-100 text-red-800"
            : type === "info"
            ? "bg-blue-100 text-blue-800"
            : "bg-yellow-100 text-yellow-800";

    return (
        <div className="relative transform transition-transform duration-500 ease-out translate-y-4 opacity-0 animate-slide-up mr-4">
            <div className={`p-4 ${alertClass}`}>
                <button onClick={() => onClose(id)} className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700">&times;</button>
                <strong>{title}</strong>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Alert;