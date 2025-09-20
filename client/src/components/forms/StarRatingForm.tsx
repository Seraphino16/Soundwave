import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getRatings,
    getRatingSummary,
    addOrUpdateRating,
    updateRating,
    deleteRating,
    Rating,
    RatingSummary,
} from "../../services/ratingService";

const ArtistRatingSection: React.FC = () => {
    const { id: artistId } = useParams<{ id: string }>();
    const [selected, setSelected] = useState<number>(0);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [average, setAverage] = useState<number>(0);
    const [hasRated, setHasRated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [myRatingId, setMyRatingId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch("http://localhost:5001/users/me", {
                    credentials: "include",
                });
                if (!res.ok) return;
                const user = await res.json();
                setCurrentUser(user.username);
            } catch (error) {
                console.error("Impossible de récupérer l'utilisateur connecté :", error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (!artistId) return;

        const fetchData = async () => {
            try {
                const ratingsData: Rating[] = await getRatings(artistId);
                setRatings(ratingsData);

                const summary: RatingSummary = await getRatingSummary(artistId);
                setAverage(summary.average || 0);

                if (currentUser) {
                    const myRating = ratingsData.find((r) => r.username === currentUser);
                    if (myRating) {
                        setHasRated(true);
                        setSelected(myRating.score);
                        setMyRatingId(myRating.id);
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement des notes :", error);
            }
        };

        fetchData();
    }, [artistId, currentUser]);

    const handleRatingClick = async (value: number) => {
        if (!artistId || hasRated) return;
        setSelected(value);

        try {
            await addOrUpdateRating(artistId, value);
            refreshRatings();
            alert(`Merci pour votre note de ${value} étoile(s) !`);
            setHasRated(true);
        } catch (error) {
            console.error("Erreur en envoyant la note :", error);
        }
    };

    const handleUpdateRating = async () => {
        if (!myRatingId) return;
        try {
            await updateRating(myRatingId, selected);
            refreshRatings();
            setIsEditing(false);
            alert("Votre note a été mise à jour ✅");
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    const handleDeleteRating = async () => {
        if (!myRatingId) return;
        try {
            await deleteRating(myRatingId);
            refreshRatings();
            setHasRated(false);
            setSelected(0);
            setMyRatingId(null);
            alert("Votre note a été supprimée ❌");
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    const refreshRatings = async () => {
        if (!artistId) return;
        const ratingsData: Rating[] = await getRatings(artistId);
        setRatings(ratingsData);
        const summary: RatingSummary = await getRatingSummary(artistId);
        setAverage(summary.average || 0);
    };

    const roundedAverage = Math.round(average * 10) / 10;

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-primaryBlue mb-6 text-center">
                Noter cet artiste
            </h2>

            <div className="flex flex-col md:flex-row gap-12 justify-center items-start">
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Votre note :
                    </h3>

                    {!hasRated ? (
                        <div className="flex justify-center md:justify-start space-x-2 text-3xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleRatingClick(star)}
                                    className="focus:outline-none"
                                >
                  <span
                      className={
                          star <= selected ? "text-yellow-400" : "text-gray-300"
                      }
                  >
                    ★
                  </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {!isEditing ? (
                                <>
                                    <p className="text-gray-600">
                                        Vous avez déjà noté cet artiste :{" "}
                                        <span className="text-yellow-500">{selected} ★</span>
                                    </p>
                                    <div className="flex gap-3 justify-center md:justify-start">
                                        <button
                                            className="px-4 py-2 bg-yellow-400 text-white rounded"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded"
                                            onClick={handleDeleteRating}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-center md:justify-start space-x-2 text-3xl">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setSelected(star)}
                                                className="focus:outline-none"
                                            >
                        <span
                            className={
                                star <= selected
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                            }
                        >
                          ★
                        </span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 justify-center md:justify-start mt-3">
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded"
                                            onClick={handleUpdateRating}
                                        >
                                            Sauvegarder
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-gray-400 text-white rounded"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Note moyenne :
                    </h3>

                    <div className="text-3xl text-yellow-400 flex justify-center md:justify-start space-x-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <span key={i}>{i <= Math.round(average) ? "★" : "☆"}</span>
                        ))}
                    </div>

                    <p className="mt-2 text-lg font-semibold text-gray-600">
                        {roundedAverage} / 5 ({ratings.length} note
                        {ratings.length > 1 ? "s" : ""})
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ArtistRatingSection;
