const API_URL = process.env.REACT_APP_API_BASE_URL;

export type ReviewTargetType = 'artist' | 'album';

export interface Review {
    id: string;
    target_type: ReviewTargetType;
    target_id: string;
    user_id: number;
    username: string;
    profile_picture: string;
    message: string;
    createdAt: string;
}

export type LocalReview = Review & { isEditing?: boolean };

const mapReview = (r: any): LocalReview => ({
    id: r._id || r.id,
    target_type: r.target_type,
    target_id: r.target_id,
    user_id: r.user_id,
    username: r.username,
    profile_picture: r.profile_picture,
    message: r.message,
    createdAt: r.createdAt,
    isEditing: false,
});

export const getReviewsByTarget = async (
    targetType: ReviewTargetType,
    targetId: string
): Promise<LocalReview[]> => {
    try {
        const response = await fetch(`${API_URL}/reviews/${targetType}/${targetId}`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Échec du chargement des reviews");
        }

        const data = await response.json();
        return data.map(mapReview);
    } catch (error) {
        console.error("Erreur getReviewsByTarget:", error);
        throw error;
    }
};

export const getMyReview = async (
    targetType: ReviewTargetType,
    targetId: string
): Promise<LocalReview | null> => {
    try {
        const response = await fetch(`${API_URL}/reviews/${targetType}/${targetId}/me`, {
            credentials: "include",
        });

        if (response.status === 404) return null;

        if (!response.ok) {
            const text = await response.text();
            const errorData = text ? JSON.parse(text) : {};
            throw new Error(
                errorData.message || "Échec du chargement de la review de l'utilisateur"
            );
        }

        const text = await response.text();
        if (!text) return null;

        const r = JSON.parse(text);
        return mapReview(r);
    } catch (error) {
        console.error("Erreur getMyReview:", error);
        throw error;
    }
};
export const createReview = async (
    targetType: ReviewTargetType,
    targetId: string,
    message: string
): Promise<LocalReview> => {
    try {
        const response = await fetch(`${API_URL}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                target_type: targetType,
                target_id: targetId,
                message,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Impossible de publier la review");
        }

        const r = await response.json();
        return mapReview(r);
    } catch (error) {
        console.error("Erreur createReview:", error);
        throw error;
    }
};

export const updateReview = async (
    id: string,
    message: string
): Promise<LocalReview> => {
    try {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Impossible de mettre à jour la review"
            );
        }

        const r = await response.json();
        return mapReview(r);
    } catch (error) {
        console.error("Erreur updateReview:", error);
        throw error;
    }
};

export const deleteReview = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/reviews/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Impossible de supprimer la review"
            );
        }
    } catch (error) {
        console.error("Erreur deleteReview:", error);
        throw error;
    }
};
