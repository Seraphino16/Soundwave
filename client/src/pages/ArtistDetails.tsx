import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchArtistById,
    fetchAlbumsByArtistId
} from "../services/spotifyService";
import AlbumCard from "../components/cards/AlbumCard"; // ✅ Import du composant

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
            <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-5xl text-center">
                {/* Artist Details */}
                <h1 className="text-4xl font-bold text-primaryBlue mb-6">{artist.name}</h1>

                <img
                    src={artist.image || "/default-avatar.png"}
                    alt={artist.name}
                    className="w-56 h-56 object-cover rounded-full mx-auto mb-6 shadow-md border"
                />

                <div className="text-lg text-gray-700 space-y-3 mb-6">
                    <p><strong>Followers:</strong> {artist.followers.toLocaleString()}</p>
                    <p><strong>Popularité:</strong> {artist.popularity}/100</p>
                    <p>
                        <strong>Genres:</strong>{" "}
                        {artist.genres.length > 0 ? artist.genres.join(", ") : "Non spécifié"}
                    </p>
                </div>

                <a
                    href={artist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-3 bg-primaryBlue text-white rounded-md hover:bg-blue-700 transition"
                >
                    Écouter sur Spotify
                </a>

                {/* Albums */}
                {albums.length > 0 && (
                    <>
                        <h2 className="text-2xl font-semibold text-primaryBlue mt-12 mb-6">Albums</h2>

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
