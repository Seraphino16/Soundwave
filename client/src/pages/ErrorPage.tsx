import React from "react";
import { Link } from "react-router-dom";
import Meta from "../components/utils/Meta";

interface ErrorPageProps {
  title: string;
  message: React.ReactNode;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionTo?: string;
  showHome?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  title,
  message,
  icon,
  actionLabel,
  actionTo,
  showHome = true,
}) => (
  <>
    <Meta title={title} description="Page d'erreur de Soundwave"/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}
        <h1 className="text-2xl font-bold text-red-500 mb-4">{title}</h1>
        <div className="mb-6 text-gray-700">{message}</div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="text-primaryBlue hover:text-[#93D9D6] transition font-semibold block mb-2"
        >
          {actionLabel}
        </Link>
      )}
      {showHome && (
        <Link
          to="/"
          className="text-gray-400 hover:text-primaryBlue transition text-sm"
        >
          Retour à l'accueil
        </Link>
      )}
    </div>
  </div>
  </>
);

export default ErrorPage;
