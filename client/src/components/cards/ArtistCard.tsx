import React from 'react';
import { Link } from 'react-router-dom';

interface ArtistProps {
    id: string;
    name: string;
    image: string;
}

const ArtistCard: React.FC<ArtistProps> = ({ id, name, image }) => {
    return (
        <Link to={`/artists/${id}`} className="bg-white shadow-lg rounded-lg p-4 w-60 flex flex-col justify-between items-center cursor-pointer hover:shadow-xl transition">
            <img src={image || "/default-avatar.png"} alt={name} className="w-full h-48 object-cover rounded-md" />
            <div className="flex-grow flex items-center justify-center mt-4">
                <h2 className="text-lg font-medium text-center">{name}</h2>
            </div>
        </Link>
    );
};

export default ArtistCard;
