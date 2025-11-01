import React, { useEffect, useState, ComponentType } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAlbumById } from "../services/spotifyService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import * as Bi from "react-icons/bi"; // ✅ import global pour typage sûr
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "components/buttons/BackButton";
import RatingSection from "components/ratings/RatingSection";
import ReviewsDetails from "components/reviews/ReviewsDetails";

// ✅ Correction des types des icônes pour TypeScript
const BiLike = Bi.BiLike as ComponentType<{ className?: string }>;
const BiSolidLike = Bi.BiSolidLike as ComponentType<{ className?: string }>;
const BiDislike = Bi.BiDislike as ComponentType<{ className?: string }>;
const BiSolidDislike = Bi.BiSolidDislike as ComponentType<{ className?: string }>;

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
    tracks?: {
        id: string;
        title: string;
        durationMs: number;
        spotifyUrl: string;
        previewUrl: string | null;
    }[];
}

const AlbumDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteTracks, setFavoriteTracks] = useState<string[]>([]);
    const [trackVotes, setTrackVotes] = useState<Record<string, "like" | "dislike" | null>>({});

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

    const toggleTrackFavorite = (trackId: string, trackTitle: string) => {
        const isFav = favoriteTracks.includes(trackId);
        if (isFav) {
            setFavoriteTracks((prev) => prev.filter((id) => id !== trackId));
            toast.info(`"${trackTitle}" retirée de votre liste`, {
                position: "bottom-right",
                autoClose: 2500,
            });
        } else {
            setFavoriteTracks((prev) => [...prev, trackId]);
            toast.success(`"${trackTitle}" ajoutée à votre liste !`, {
                position: "bottom-right",
                autoClose: 2500,
            });
        }
    };

    const handleTrackVote = (trackId: string, type: "like" | "dislike") => {
        setTrackVotes((prev) => ({
            ...prev,
            [trackId]: prev[trackId] === type ? null : type, // toggle
        }));

        toast(
            type === "like"
                ? "👍 Vous aimez cette piste"
                : "👎 Vous n'aimez pas cette piste",
            {
                position: "bottom-right",
                autoClose: 2000,
            }
        );
    };

    const formatDuration = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
                <p className="text-xl font-semibold text-red-600">Album introuvable</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-lg p-6 sm:p-10 w-full max-w-6xl relative">
                <BackButton to="/albums" className="absolute top-4 sm:top-6 left-4 sm:left-6" />

                {/* === En-tête album === */}
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
                            <p><strong>Date de sortie :</strong> {album.releaseDate}</p>
                            <p><strong>Nombre de titres :</strong> {album.totalTracks}</p>

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

                            {/* === Bouton favoris album === */}
                            <button
                                onClick={handleToggleFavorite}
                                aria-label={isFavorite ? "Retirer de ma liste" : "Ajouter à ma liste"}
                                className="mt-4 p-2 rounded-full shadow-md bg-primaryBlue text-white hover:bg-[#B0C7E6] transition mx-auto md:mx-0"
                            >
                                {isFavorite ? (
                                    <FaHeart className="text-red-500 text-xl" />
                                ) : (
                                    <FaRegHeart className="text-xl" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* === Liste des pistes === */}
                <h2 className="text-2xl sm:text-3xl font-bold text-primaryBlue text-center mb-6">
                    Liste des pistes
                </h2>

                {album.tracks && album.tracks.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm sm:text-base text-gray-700 mb-10">
                            <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-2 px-3">Titre</th>
                                <th className="py-2 px-3 text-right">Durée</th>
                                <th className="py-2 px-3 text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {album.tracks.map((track) => (
                                <tr key={track.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 px-3">{track.title}</td>
                                    <td className="py-2 px-3 text-right">
                                        {formatDuration(track.durationMs)}
                                    </td>
                                    <td className="py-2 px-3 text-right flex justify-end items-center gap-3">
                                        {/* === Favoris === */}
                                        <button
                                            onClick={() => toggleTrackFavorite(track.id, track.title)}
                                            aria-label={favoriteTracks.includes(track.id) ? "Retirer" : "Ajouter"}
                                            className="p-2 rounded-full bg-primaryBlue text-white hover:bg-[#B0C7E6] transition"
                                        >
                                            {favoriteTracks.includes(track.id) ? (
                                                <FaHeart className="text-red-500 text-lg" />
                                            ) : (
                                                <FaRegHeart className="text-lg" />
                                            )}
                                        </button>

                                        {/* === Like === */}
                                        <button
                                            onClick={() => handleTrackVote(track.id, "like")}
                                            aria-label="J'aime"
                                            className={`p-2 rounded-full transition ${
                                                trackVotes[track.id] === "like"
                                                    ? "bg-green-100 text-green-600"
                                                    : "hover:text-green-600"
                                            }`}
                                        >
                                            {trackVotes[track.id] === "like" ? (
                                                <BiSolidLike className="text-xl" />
                                            ) : (
                                                <BiLike className="text-xl" />
                                            )}
                                        </button>

                                        {/* === Dislike === */}
                                        <button
                                            onClick={() => handleTrackVote(track.id, "dislike")}
                                            aria-label="Je n'aime pas"
                                            className={`p-2 rounded-full transition ${
                                                trackVotes[track.id] === "dislike"
                                                    ? "bg-red-100 text-red-600"
                                                    : "hover:text-red-600"
                                            }`}
                                        >
                                            {trackVotes[track.id] === "dislike" ? (
                                                <BiSolidDislike className="text-xl" />
                                            ) : (
                                                <BiDislike className="text-xl" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mb-10">
                        Aucune piste disponible.
                    </p>
                )}

                {/* === Avis / Notes === */}
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
