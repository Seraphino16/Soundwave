import React from 'react';

interface ArtistProps {
    name: string;
    image: string;
}

const ArtistCard: React.FC<ArtistProps> = ({ name, image }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 w-60 flex flex-col justify-between items-center">

            <img src={image || "/default-avatar.png"} alt={name} className="w-full h-48 object-cover rounded-md" />

            <div className="flex-grow flex items-center justify-center mt-4">
                <h2 className="text-lg font-medium text-center">{name}</h2>
            </div>
        </div>
    );
};

export default ArtistCard;