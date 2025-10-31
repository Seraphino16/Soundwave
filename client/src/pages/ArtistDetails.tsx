import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    fetchArtistById,
    fetchAlbumsByArtistId,
} from "../services/spotifyService";
import AlbumCard from "../components/cards/AlbumCard";
import RatingSection from "components/ratings/RatingSection";
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
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-lg p-6 sm:p-10 w-full max-w-6xl relative">
                <BackButton
                    to="/artists"
                    className="absolute top-4 sm:top-6 left-4 sm:left-6"
                />

                <div className="mb-10 w-full max-w-4xl mx-auto">
                    <h1 className="mt-10 sm:mt-0 text-3xl sm:text-4xl font-bold text-primaryBlue text-center mb-8 sm:mb-10">
                        {artist.name}
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <img
                            src={artist.image || "/default-avatar.png"}
                            alt={artist.name}
                            className="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-full shadow-md border"
                        />

                        <div className="text-center md:text-left w-full md:w-auto">
                            <div className="text-base sm:text-lg text-gray-700 space-y-2">
                                <p>
                                    <strong>Followers :</strong>{" "}
                                    {artist.followers.toLocaleString()}
                                </p>
                                <p>
                                    <strong>Popularité :</strong> {artist.popularity}/100
                                </p>
                                <p>
                                    <strong>Genres :</strong>{" "}
                                    {artist.genres.length > 0
                                        ? artist.genres.join(", ")
                                        : "Non spécifié"}
                                </p>
                            </div>

                            <button
                                onClick={handleToggleFavorite}
                                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg shadow-md bg-primaryBlue text-white hover:bg-[#B0C7E6] transition mx-auto md:mx-0"
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
                    <section className="mt-10 sm:mt-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primaryBlue text-center mb-6">
                            Albums
                        </h2>

                        <div className="overflow-x-auto scrollbar-transparent">
                            <div className="flex gap-28 sm:gap-12 md:gap-16 lg:gap-24 px-2 pb-2 min-w-max">
                                {albums.map((album) => (
                                    <div
                                        key={album.id}
                                        className="flex-shrink-0 w-40 sm:w-44 md:w-48"
                                    >
                                        <AlbumCard
                                            id={album.id}
                                            title={album.title}
                                            coverImage={album.coverImage || "/default-cover.png"}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <div className="my-8 sm:my-10 border-t border-gray-300 opacity-30" />

                <RatingSection targetType="artist" targetId={artist.id} />

                <div className="my-8 sm:my-10 border-t border-gray-300 opacity-30" />

                <ReviewsDetails targetType="artist" />
            </div>

            <ToastContainer />
        </div>
    );
};

export default ArtistDetail;
