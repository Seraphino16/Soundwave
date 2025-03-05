import React, { useEffect, useState } from "react";
import { fetchAlbums } from "../services/spotifyService";
import AlbumCard from "../components/cards/AlbumCard";

interface Album {
    title: string;
    coverImage: string;
}

const Albums: React.FC = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAlbums = async () => {
            const data = await fetchAlbums();
            if (data && data.albums) {
                setAlbums(data.albums.slice(0, 12)); // ✅ Limite à 12 albums
            }
            setLoading(false);
        };

        loadAlbums();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen pt-32 pb-20">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-10">
                <h1 className="text-3xl font-bold text-center mb-8 text-primaryBlue">
                    ALBUMS
                </h1>

                {loading ? (
                    <p className="text-center">Chargement...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 ml-20">
                        {albums.map((album, index) => (
                            <AlbumCard key={index} title={album.title} coverImage={album.coverImage} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Albums;
