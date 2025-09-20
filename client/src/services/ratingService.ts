/**
 * @description Service de gestion des notes (Ratings) de SoundWave
 */

const API_URL = "http://localhost:5001";

export interface Rating {
    id: string;
    username: string;
    score: number;
    createdAt: string;
}

export interface RatingSummary {
    average: number;
    count: number;
}


export const getRatings = async (artistId: string): Promise<Rating[]> => {
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


export const getRatingSummary = async (
    artistId: string,
): Promise<RatingSummary> => {
    try {
        const response = await fetch(`${API_URL}/ratings/${artistId}/summary`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Échec du chargement du résumé des notes",
            );
        }

        return response.json();
    } catch (error) {
        console.error("Erreur getRatingSummary:", error);
        throw error;
    }
};


export const addOrUpdateRating = async (
    artistId: string,
    score: number,
): Promise<Rating> => {
    try {
        const response = await fetch(`${API_URL}/ratings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                artist_id: artistId,
                score,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Impossible d'enregistrer la note",
            );
        }

        return response.json();
    } catch (error) {
        console.error("Erreur addOrUpdateRating:", error);
        throw error;
    }
};


export const updateRating = async (
    ratingId: string,
    score: number,
): Promise<Rating> => {
    try {
        const response = await fetch(`${API_URL}/ratings/${ratingId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ score }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Impossible de modifier la note");
        }

        return response.json();
    } catch (error) {
        console.error("Erreur updateRating:", error);
        throw error;
    }
};

export const deleteRating = async (ratingId: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/ratings/${ratingId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Impossible de supprimer la note");
        }
    } catch (error) {
        console.error("Erreur deleteRating:", error);
        throw error;
    }
};
