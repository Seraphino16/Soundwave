import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getRatings,
    getRatingSummary,
    addOrUpdateRating,
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

    // Charger l'utilisateur connecté
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

    // Charger les notes et la moyenne
    useEffect(() => {
        if (!artistId) return;

        const fetchData = async () => {
            try {
                const ratingsData: Rating[] = await getRatings(artistId);
                setRatings(ratingsData);

                const summary: RatingSummary = await getRatingSummary(artistId);
                setAverage(summary.average || 0);

                // Vérifier si l'utilisateur a déjà noté
                if (currentUser) {
                    const myRating = ratingsData.find(
                        (r) => r.username === currentUser
                    );
                    if (myRating) {
                        setHasRated(true);
                        setSelected(myRating.score);
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement des notes :", error);
            }
        };

        fetchData();
    }, [artistId, currentUser]);

    // Envoyer une nouvelle note
    const handleRatingClick = async (value: number) => {
        if (!artistId || hasRated) return; // blocage si déjà noté
        setSelected(value);

        try {
            await addOrUpdateRating(artistId, value);

            const ratingsData: Rating[] = await getRatings(artistId);
            setRatings(ratingsData);

            const summary: RatingSummary = await getRatingSummary(artistId);
            setAverage(summary.average || 0);

            alert(`Merci pour votre note de ${value} étoile(s) !`);
            setHasRated(true);
        } catch (error) {
            console.error("Erreur en envoyant la note :", error);
        }
    };

    const roundedAverage = Math.round(average * 10) / 10;

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-primaryBlue mb-6 text-center">
                Noter cet artiste
            </h2>

            <div className="flex flex-col md:flex-row gap-12 justify-center items-start">
                {/* Formulaire de notation */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Votre note :
                    </h3>

                    {hasRated ? (
                        <p className="text-gray-600">
                            Vous avez déjà noté cet artiste :{" "}
                            <span className="text-yellow-500">{selected} ★</span>
                        </p>
                    ) : (
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
                    )}
                </div>

                {/* Moyenne des notes */}
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
