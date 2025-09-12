/**
 * @description Service de gestion des notes (Ratings) de SoundWave
 * @author
 */

const API_URL = "http://localhost:5001";

export const getRatings = async (artistId: number) => {
    try {
        const response = await fetch(`${API_URL}/ratings/${artistId}`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Échec du chargement des notes");
        }

        const data = await response.json();

        return data.map((r: any) => ({
            id: r._id || r.id,
            username: r.username,
            score: r.score,
            createdAt: r.createdAt,
        }));
    } catch (error) {
        console.error("Erreur getRatings:", error);
        throw error;
    }
};

export const getRatingSummary = async (artistId: number) => {
    try {
        const response = await fetch(`${API_URL}/ratings/${artistId}/summary`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Échec du chargement du résumé des notes");
        }

        return response.json();
    } catch (error) {
        console.error("Erreur getRatingSummary:", error);
        throw error;
    }
};

export const addOrUpdateRating = async (artistId: number, score: number) => {
    try {
        const response = await fetch(`${API_URL}/ratings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            },
            credentials: "include",
            body: JSON.stringify({
                artist_id: artistId,
                score,
            }),
        });

        //console.log(process.env.REACT_APP_API_KEY);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Impossible d'enregistrer la note");
        }

        return response.json();
    } catch (error) {
        console.error("Erreur addOrUpdateRating:", error);
        throw error;
    }
};
