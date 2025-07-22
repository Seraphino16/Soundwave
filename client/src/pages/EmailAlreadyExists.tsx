import React from "react";
import { Link } from "react-router-dom";

const EmailAlreadyExists: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Email déjà utilisé</h1>
      <p className="mb-6">
        Un compte existe déjà avec cette adresse email.<br/>
        Essayez de vous connecter ou utilisez un autre email.
      </p>
      <Link
        to="/auth"
        className="text-primaryBlue hover:text-[#93D9D6] transition font-semibold"
      >
        Retour à la connexion
      </Link>
    </div>
  </div>
);

export default EmailAlreadyExists;
