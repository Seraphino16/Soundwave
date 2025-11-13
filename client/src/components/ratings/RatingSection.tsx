import React, { useEffect, useState } from "react";
import {
    getRatings,
    getRatingSummary,
    addOrUpdateRating,
    updateRating,
    deleteRating,
    Rating,
    RatingSummary,
    RatingTargetType,
} from "../../services/ratingService";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { TfiSave as TfiSaveRaw } from "react-icons/tfi";
import {
    IoStarOutline as IoStarOutlineRaw,
    IoStarSharp as IoStarSharpRaw,
    IoStarHalfOutline as IoStarHalfOutlineRaw,
} from "react-icons/io5";
import { toast } from "react-toastify";

const IoStarOutline = IoStarOutlineRaw as React.ElementType;
const IoStarSharp = IoStarSharpRaw as React.ElementType;
const IoStarHalfOutline = IoStarHalfOutlineRaw as React.ElementType;
const TfiSave = TfiSaveRaw as React.ElementType;

interface RatingSectionProps {
    targetType: RatingTargetType;
    targetId: string;
}

const RatingSection: React.FC<RatingSectionProps> = ({ targetType, targetId }) => {
    const [selected, setSelected] = useState<number>(0);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [average, setAverage] = useState<number>(0);
    const [hasRated, setHasRated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [myRatingId, setMyRatingId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/me`, {
                    credentials: "include",
                });
                if (!res.ok) return;
                const user = await res.json();
                setCurrentUser(user.username);

                const ratingsData: Rating[] = await getRatings(targetType, targetId);
                setRatings(ratingsData);

                const summary: RatingSummary = await getRatingSummary(targetType, targetId);
                setAverage(summary.average || 0);

                const myRating = ratingsData.find((r) => r.username === user.username);
                if (myRating) {
                    setHasRated(true);
                    setSelected(myRating.score);
                    setMyRatingId(myRating.id);
                } else {
                    setHasRated(false);
                    setSelected(0);
                    setMyRatingId(null);
                }
            } catch (error) {
                console.error("Erreur lors du chargement initial :", error);
            }
        };

        fetchAllData();
    }, [targetId, targetType]);

    const refreshRatings = async () => {
        try {
            const ratingsData: Rating[] = await getRatings(targetType, targetId);
            setRatings(ratingsData);
            const summary: RatingSummary = await getRatingSummary(targetType, targetId);
            setAverage(summary.average || 0);

            if (currentUser) {
                const myRating = ratingsData.find((r) => r.username === currentUser);
                if (myRating) {
                    setHasRated(true);
                    setSelected(myRating.score);
                    setMyRatingId(myRating.id);
                } else {
                    setHasRated(false);
                    setSelected(0);
                    setMyRatingId(null);
                }
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour des notes :", error);
        }
    };

    const handleRatingClick = async (value: number) => {
        if (!targetId || hasRated) return;
        setSelected(value);

        try {
            await addOrUpdateRating(targetType, targetId, value);
            toast.success(`Merci pour votre note de ${value} étoile(s) ⭐`, {
                position: "bottom-right",
                autoClose: 2500,
            });
            await refreshRatings();
        } catch (error) {
            console.error("Erreur en envoyant la note :", error);
        }
    };

    const handleUpdateRating = async () => {
        if (!myRatingId) return;
        try {
            await updateRating(myRatingId, selected);
            toast.success("Votre note a été mise à jour ✅", {
                position: "bottom-right",
                autoClose: 2500,
            });
            setIsEditing(false);
            await refreshRatings();
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    const handleDeleteRating = async () => {
        if (!myRatingId) return;
        try {
            await deleteRating(myRatingId);
            toast.info("Votre note a été supprimée ❌", {
                position: "bottom-right",
                autoClose: 2500,
            });
            await refreshRatings();
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const roundedAverage = Math.round(average * 10) / 10;

    return (
        <div className="mt-10">
            <div className="flex flex-col md:flex-row justify-center items-start gap-12">
                {/* ===== Votre note ===== */}
                <div className="w-full md:w-1/2 mx-auto text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Votre note
                    </h3>

                    {!hasRated ? (
                        <div className="flex justify-center space-x-2 text-2xl text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingClick(star)}
                                    className="focus:outline-none"
                                >
                                    {star <= selected ? <IoStarSharp /> : <IoStarOutline />}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {!isEditing ? (
                                <>
                                    <p className="text-gray-600 flex items-center justify-center gap-1">
                                        Vous avez noté ce {targetType === "artist" ? "artiste" : "album"} :{" "}
                                        <span className="text-yellow-500 flex items-center gap-1">
                                            {selected}
                                            <IoStarSharp className="text-yellow-500 text-base" />
                                        </span>
                                    </p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-2 rounded-full text-primaryBlue hover:bg-primaryBlue/10 transition"
                                            aria-label="Modifier"
                                        >
                                            <FiEdit2 className="text-xl" />
                                        </button>
                                        <button
                                            onClick={handleDeleteRating}
                                            className="p-2 rounded-full text-primaryBlue hover:bg-primaryBlue/10 transition"
                                            aria-label="Supprimer"
                                        >
                                            <FiTrash2 className="text-xl" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-center space-x-2 text-2xl text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setSelected(star)}
                                                className="focus:outline-none"
                                            >
                                                {star <= selected ? <IoStarSharp /> : <IoStarOutline />}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 justify-center mt-3">
                                        <button
                                            onClick={handleUpdateRating}
                                            className="p-2 rounded-full text-primaryBlue hover:bg-primaryBlue/10 transition"
                                            aria-label="Sauvegarder"
                                        >
                                            <TfiSave className="text-xl" />
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="p-2 rounded-full text-primaryBlue hover:bg-primaryBlue/10 transition"
                                            aria-label="Annuler"
                                        >
                                            <FiX className="text-xl" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="w-full md:w-1/2 mx-auto text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Note moyenne
                    </h3>

                    <div className="flex justify-center items-center gap-4 mt-2">
                        <div className="flex space-x-1 text-2xl text-yellow-400">
                            {[1, 2, 3, 4, 5].map((i) => {
                                if (i <= Math.floor(average)) {
                                    return <IoStarSharp key={i} />;
                                } else if (i === Math.ceil(average) && !Number.isInteger(average)) {
                                    return <IoStarHalfOutline key={i} />;
                                } else {
                                    return <IoStarOutline key={i} />;
                                }
                            })}
                        </div>
                        <p className="text-lg font-semibold text-gray-600">
                            {roundedAverage} / 5 ({ratings.length} note
                            {ratings.length > 1 ? "s" : ""})
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingSection;
