import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArtistById } from "../services/spotifyService";

interface Artist {
    id: string;
    name: string;
    image: string | null;
    followers: number;
    genres: string[];
    popularity: number;
    spotifyUrl: string;
}

const ArtistDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArtist = async () => {
            const data = await fetchArtistById(id!);
            setArtist(data);
            setLoading(false);
        };

        loadArtist();
    }, [id]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-4xl text-center">
                {loading ? (
                    <p className="text-center">Chargement...</p>
                ) : artist ? (
                    <>
                        <h1 className="text-4xl font-bold text-primaryBlue mb-4">{artist.name}</h1>
                        <img src={artist.image || "/default-avatar.png"} alt={artist.name} className="w-64 h-64 object-cover rounded-full mx-auto" />

                        <p className="text-lg mt-4"><strong>Followers:</strong> {artist.followers.toLocaleString()}</p>
                        <p className="text-lg mt-2"><strong>Popularité:</strong> {artist.popularity}/100</p>

                        <p className="text-lg mt-2"><strong>Genres:</strong> {artist.genres.length > 0 ? artist.genres.join(", ") : "Non spécifié"}</p>

                        <a href={artist.spotifyUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block px-4 py-2 bg-primaryBlue text-white rounded-lg hover:bg-blue-700 transition">
                            Écouter sur Spotify
                        </a>
                    </>
                ) : (
                    <p className="text-center">Artiste introuvable</p>
                )}
            </div>
        </div>
    );
};

export default ArtistDetail;
