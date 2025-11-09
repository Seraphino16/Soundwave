import React from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string | number;
  label?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ to = -1, label = "← Retour", className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    typeof to === "number" ? navigate(to) : navigate(to);
  };

  return (
    <button onClick={handleClick} className={`px-4 py-2 text-lg text-primaryBlue font-semibold rounded-md hover:underline transition ${className}`}>
      {label}
    </button>
  );
};

export default BackButton;
