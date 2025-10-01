import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchArtistById,
    fetchAlbumsByArtistId,
} from "../services/spotifyService";
import AlbumCard from "../components/cards/AlbumCard";
import ArtistRatingSection from "components/forms/StarRatingForm";
import ReviewsDetails from "components/reviews/ReviewsDetails";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "components/buttons/BackButton";

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

    const [isFavorite, setIsFavorite] = useState(false);

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

    const handleToggleFavorite = () => {
        if (artist) {
            if (isFavorite) {
                toast.info(`${artist.name} a été retiré de votre liste`, {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            } else {
                toast.success(`${artist.name} a été ajouté à votre liste !`, {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }
            setIsFavorite(!isFavorite);
        }
    };

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
                <p className="text-xl font-semibold text-red-600">
                    Artiste introuvable
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-5xl relative">
                <BackButton to="/artists" className="absolute top-6 left-6" />

                <div className="mb-10 w-full max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-primaryBlue text-center mb-10">
                        {artist.name}
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
                        <img
                            src={artist.image || "/default-avatar.png"}
                            alt={artist.name}
                            className="w-56 h-56 object-cover rounded-full shadow-md border"
                        />

                        <div className="text-center md:text-left">
                            <div className="text-lg text-gray-700 space-y-2">
                                <p>
                                    <strong>Followers:</strong>{" "}
                                    {artist.followers.toLocaleString()}
                                </p>
                                <p>
                                    <strong>Popularité:</strong>{" "}
                                    {artist.popularity}/100
                                </p>
                                <p>
                                    <strong>Genres:</strong>{" "}
                                    {artist.genres.length > 0
                                        ? artist.genres.join(", ")
                                        : "Non spécifié"}
                                </p>
                            </div>

                            <button
                                onClick={handleToggleFavorite}
                                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-md bg-primaryBlue text-white hover:bg-[#B0C7E6] transition"
                            >
                                {isFavorite ? (
                                    <>
                                        <FaHeart className="text-red-500" />
                                        Retirer de ma liste
                                    </>
                                ) : (
                                    <>
                                        <FaRegHeart />
                                        Ajouter à ma liste
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {albums.length > 0 && (
                    <>
                        <h2 className="text-2xl font-semibold text-primaryBlue mt-8 mb-4">
                            Albums
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {albums.map((album) => (
                                <AlbumCard
                                    key={album.id}
                                    id={album.id}
                                    title={album.title}
                                    coverImage={
                                        album.coverImage || "/default-cover.png"
                                    }
                                />
                            ))}
                        </div>
                    </>
                )}
                <div className="my-10 border-t border-gray-300 opacity-30" />
                <ArtistRatingSection />
                <div className="my-10 border-t border-gray-300 opacity-30" />
                <ReviewsDetails />
            </div>

            <ToastContainer />
        </div>
    );
};

export default ArtistDetail;
