import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchArtistById,
    fetchAlbumsByArtistId
} from "../services/spotifyService";
import AlbumCard from "../components/cards/AlbumCard";

interface Artist {
    id: string;
    name: string;
    image: string | null;
    followers: number;
    genres: string[];
    popularity: number;
    spotifyUrl: string;
}

interface Album {
    id: string;
    title: string;
    coverImage: string | null;
}

const ArtistDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const artistData = await fetchArtistById(id!);
                const albumData = await fetchAlbumsByArtistId(id!);
                setArtist(artistData);
                setAlbums(albumData.albums);
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl font-medium text-gray-600">Chargement...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl font-semibold text-red-600">Artiste introuvable</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-5xl">

                <div className="mb-10 w-full max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-primaryBlue text-center mb-10">{artist.name}</h1>

                    <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-8 md:gap-20">
                        <img
                            src={artist.image || "/default-avatar.png"}
                            alt={artist.name}
                            className="w-56 h-56 object-cover rounded-full shadow-md border"
                        />

                        <div className="text-center md:text-left">
                            <div className="text-lg text-gray-700 space-y-2">
                                <p><strong>Followers:</strong> {artist.followers.toLocaleString()}</p>
                                <p><strong>Popularité:</strong> {artist.popularity}/100</p>
                                <p>
                                    <strong>Genres:</strong>{" "}
                                    {artist.genres.length > 0
                                        ? artist.genres.join(", ")
                                        : "Non spécifié"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {albums.length > 0 && (
                    <>
                        <h2 className="text-2xl font-semibold text-primaryBlue mt-8 mb-4">Albums</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {albums.map((album) => (
                                <AlbumCard
                                    key={album.id}
                                    id={album.id}
                                    title={album.title}
                                    coverImage={album.coverImage || "/default-cover.png"}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ArtistDetail;
