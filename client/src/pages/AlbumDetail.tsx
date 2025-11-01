import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAlbumById } from "../services/spotifyService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "components/buttons/BackButton";
import RatingSection from "components/ratings/RatingSection";
import ReviewsDetails from "components/reviews/ReviewsDetails";

interface Album {
    id: string;
    title: string;
    coverImage: string;
    releaseDate: string;
    totalTracks: number;
    spotifyUrl: string;
    artists?: {
        id: string;
        name: string;
        spotifyUrl: string;
    }[];
}

const AlbumDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const loadAlbum = async () => {
            try {
                const data = await fetchAlbumById(id!);
                setAlbum(data);
            } catch (error) {
                console.error("Erreur lors du chargement de l'album:", error);
            } finally {
                setLoading(false);
            }
        };

        loadAlbum();
    }, [id]);

    const handleToggleFavorite = () => {
        if (!album) return;

        if (isFavorite) {
            toast.info(`${album.title} a été retiré de votre liste`, {
                position: "bottom-right",
                autoClose: 3000,
            });
        } else {
            toast.success(`${album.title} a été ajouté à votre liste !`, {
                position: "bottom-right",
                autoClose: 3000,
            });
        }

        setIsFavorite(!isFavorite);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl font-medium text-gray-600">Chargement...</p>
            </div>
        );
    }

    if (!album) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl font-semibold text-red-600">
                    Album introuvable
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-lg p-6 sm:p-10 w-full max-w-6xl relative">
                <BackButton to="/albums" className="absolute top-4 sm:top-6 left-4 sm:left-6" />

                <div className="mb-10 w-full max-w-4xl mx-auto">
                    <h1 className="mt-10 sm:mt-0 text-3xl sm:text-4xl font-bold text-primaryBlue text-center mb-8 sm:mb-10">
                        {album.title}
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <img
                            src={album.coverImage || "/default-album.png"}
                            alt={album.title}
                            className="w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-lg shadow-md border"
                        />

                        <div className="text-center md:text-left w-full md:w-auto text-base sm:text-lg text-gray-700 space-y-2">
                            <p>
                                <strong>Date de sortie :</strong> {album.releaseDate}
                            </p>
                            <p>
                                <strong>Nombre de titres :</strong> {album.totalTracks}
                            </p>

                            {album.artists && album.artists.length > 0 && (
                                <p>
                                    <strong>Artiste{album.artists.length > 1 ? "s" : ""} :</strong>{" "}
                                    {album.artists.map((artist, index, arr) => (
                                        <span key={artist.id}>
                                            <Link
                                                to={`/artists/${artist.id}`}
                                                className="text-primaryBlue hover:underline"
                                            >
                                                {artist.name}
                                            </Link>
                                            {index < arr.length - 1 && ", "}
                                        </span>
                                    ))}
                                </p>
                            )}

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

                <div className="my-8 sm:my-10 border-t border-gray-300 opacity-30" />
                <h2 className="text-2xl sm:text-3xl font-bold text-primaryBlue text-center mb-6">
                    Liste des pistes
                </h2>

                <div className="my-8 sm:my-10 border-t border-gray-300 opacity-30" />
                <RatingSection targetType="album" targetId={album.id} />

                <div className="my-8 sm:my-10 border-t border-gray-300 opacity-30" />
                <ReviewsDetails targetType="album" />
            </div>

            <ToastContainer />
        </div>
    );
};

export default AlbumDetail;
