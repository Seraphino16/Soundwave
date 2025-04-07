import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAlbumById } from "../services/spotifyService";

interface Album {
    id: string;
    title: string;
    coverImage: string;
    releaseDate: string;
    totalTracks: number;
    spotifyUrl: string;
}

const AlbumDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAlbum = async () => {
            const data = await fetchAlbumById(id!);
            setAlbum(data);
            setLoading(false);
        };

        loadAlbum();
    }, [id]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-4xl text-center">
                {loading ? (
                    <p className="text-center">Chargement...</p>
                ) : album ? (
                    <>
                        <h1 className="text-4xl font-bold text-primaryBlue mb-4">{album.title}</h1>
                        <img src={album.coverImage || "/default-album.png"} alt={album.title} className="w-64 h-64 object-cover rounded-lg mx-auto" />
                        <p className="text-lg mt-4"><strong>Date de sortie :</strong> {album.releaseDate}</p>
                        <p className="text-lg mt-2"><strong>Nombre de titres :</strong> {album.totalTracks}</p>

                        <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-700 transition">
                            Écouter sur Spotify
                        </a>
                    </>
                ) : (
                    <p className="text-center">Album introuvable</p>
                )}
            </div>
        </div>
    );
};

export default AlbumDetail;