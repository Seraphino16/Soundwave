import React from 'react';
import { Link } from 'react-router-dom';

interface AlbumProps {
    id: string;
    title: string;
    coverImage: string;
}

const AlbumCard: React.FC<AlbumProps> = ({ id, title, coverImage }) => {
    return (
        <Link to={`/albums/${id}`} className="bg-white shadow-lg rounded-lg p-4 w-60 flex flex-col justify-between items-center cursor-pointer hover:shadow-xl transition">

            <img src={coverImage || "/default-album.png"} alt={title} className="w-full h-48 object-cover rounded-md" />

            <div className="flex-grow flex items-center justify-center mt-4">
                <h2 className="text-lg font-medium text-center">{title}</h2>
            </div>
        </Link>
    );
};

export default AlbumCard;