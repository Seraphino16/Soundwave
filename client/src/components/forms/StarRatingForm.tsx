import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Rating {
    id: number;
    username: string;
    score: number;
    createdAt: string;
}

const ArtistRatingSection: React.FC = () => {
    const { id: artistId } = useParams<{ id: string }>(); // id de l'artiste (Spotify ou interne)
    const [selected, setSelected] = useState<number>(0);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [average, setAverage] = useState<number>(0);

    // Charger les notes au montage
    useEffect(() => {
        if (!artistId) return;

        const fetchRatings = async () => {
            try {
                const res = await fetch(`http://localhost:3000/ratings/${artistId}`);
                const data: Rating[] = await res.json();
                setRatings(data);

                const summaryRes = await fetch(
                    `http://localhost:3000/ratings/${artistId}/summary`
                );
                const summary = await summaryRes.json();
                setAverage(summary.average || 0);
            } catch (error) {
                console.error("Erreur lors du chargement des notes :", error);
            }
        };

        fetchRatings();
    }, [artistId]);

    const handleRatingClick = async (value: number) => {
        if (!artistId) return;

        setSelected(value);

        try {
            const token = localStorage.getItem("token"); // JWT stocké côté client

            const res = await fetch("http://localhost:3000/ratings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // envoi du token JWT
                },
                body: JSON.stringify({
                    artistId,
                    score: value,
                }),
            });

            if (!res.ok) {
                throw new Error("Impossible d'enregistrer la note");
            }

            // Recharge les notes après ajout
            const updatedRatings = await fetch(
                `http://localhost:3000/ratings/${artistId}`
            ).then((r) => r.json());
            setRatings(updatedRatings);

            const summary = await fetch(
                `http://localhost:3000/ratings/${artistId}/summary`
            ).then((r) => r.json());
            setAverage(summary.average || 0);

            alert(`Merci pour votre note de ${value} étoile(s) !`);
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
                    {selected > 0 && (
                        <p className="mt-4 text-green-600 font-medium">
                            Vous avez noté : {selected} étoile(s)
                        </p>
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
