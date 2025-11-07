/**
 * @description Service unifié de gestion des notes (Ratings) de SoundWave
 */

const API_URL = "http://localhost:5001";

export type RatingTargetType = 'artist' | 'album';

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

/**
 * Obtenir toutes les notes pour un artiste ou un album
 */
export const getRatings = async (
    targetType: RatingTargetType,
    targetId: string
): Promise<Rating[]> => {
    try {
        const response = await fetch(`${API_URL}/ratings/${targetType}/${targetId}`, {
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

/**
 * Obtenir le résumé (moyenne, nombre de notes)
 */
export const getRatingSummary = async (
    targetType: RatingTargetType,
    targetId: string
): Promise<RatingSummary> => {
    try {
        const response = await fetch(`${API_URL}/ratings/${targetType}/${targetId}/summary`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Échec du chargement du résumé des notes"
            );
        }

        return response.json();
    } catch (error) {
        console.error("Erreur getRatingSummary:", error);
        throw error;
    }
};

/**
 * Ajouter ou mettre à jour une note pour un artiste ou un album
 */
export const addOrUpdateRating = async (
    targetType: RatingTargetType,
    targetId: string,
    score: number
): Promise<Rating> => {
    try {
        const response = await fetch(`${API_URL}/ratings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                target_type: targetType,
                target_id: targetId,
                score,
            }),
        });

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

/**
 * Modifier une note existante (par ID)
 */
export const updateRating = async (
    ratingId: string,
    score: number
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

/**
 * Supprimer une note (par ID)
 */
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
