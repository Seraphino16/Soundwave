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
                setAlbums(data.albums);
            }
            setLoading(false);
        };

        loadAlbums();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold text-center mb-6">Nouveaux Albums</h1>

            {loading ? (
                <p className="text-center">Chargement...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {albums.map((album, index) => (
                        <AlbumCard key={index} title={album.title} coverImage={album.coverImage} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Albums;