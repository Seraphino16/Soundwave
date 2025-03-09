import React from 'react';

interface AlbumProps {
    title: string;
    coverImage: string;
}

const AlbumCard: React.FC<AlbumProps> = ({ title, coverImage }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 w-60 flex flex-col justify-between items-center">

            <img src={coverImage} alt={title} className="w-full h-48 object-cover rounded-md" />

            <div className="flex-grow flex items-center justify-center mt-4">
                <h2 className="text-lg font-medium text-center">{title}</h2>
            </div>
        </div>
    );
};

export default AlbumCard;
