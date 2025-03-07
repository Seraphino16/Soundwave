import React from 'react';

interface AlbumProps {
    title: string;
    coverImage: string;
}

const AlbumCard: React.FC<AlbumProps> = ({ title, coverImage }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 w-60">
            <img src={coverImage} alt={title} className="w-full h-48 object-cover rounded-md" />
            <h2 className="text-lg font-medium mt-2 text-center">{title}</h2>
        </div>
    );
};

export default AlbumCard;