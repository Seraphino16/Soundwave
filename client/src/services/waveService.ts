/**
 * @description Service de gestion des Waves de SoundWave
 */

const API_URL = "http://localhost:5001";

export interface Wave {
    id: string;
    artist_id: string;
    user_id: number;
    username: string;
    profile_picture: string;
    message: string;
    createdAt: string;
}

export type LocalWave = Wave & { isEditing?: boolean };

const mapWave = (w: any): LocalWave => ({
    id: w._id || w.id,
    artist_id: w.artist_id,
    user_id: w.user_id,
    username: w.username,
    profile_picture: w.profile_picture,
    message: w.message,
    createdAt: w.createdAt,
    isEditing: false,
});

export const getWavesByArtist = async (artistId: string): Promise<LocalWave[]> => {
    try {
        const response = await fetch(`${API_URL}/waves/${artistId}`, {
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Échec du chargement des waves");
        }

        const data = await response.json();
        return data.map(mapWave);
    } catch (error) {
        console.error("Erreur getWavesByArtist:", error);
        throw error;
    }
};

export const getMyWave = async (artistId: string): Promise<LocalWave | null> => {
    try {
        const response = await fetch(`${API_URL}/waves/${artistId}/me`, {
            credentials: "include",
        });

        if (response.status === 404) return null;

        if (!response.ok) {
            const text = await response.text();
            const errorData = text ? JSON.parse(text) : {};
            throw new Error(
                errorData.message || "Échec du chargement de la wave de l'utilisateur"
            );
        }

        const text = await response.text();
        if (!text) return null;

        const w = JSON.parse(text);
        return mapWave(w);
    } catch (error) {
        console.error("Erreur getMyWave:", error);
        throw error;
    }
};


export const createWave = async (
    artist_id: string,
    message: string
): Promise<LocalWave> => {
    try {
        const response = await fetch(`${API_URL}/waves`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ artist_id, message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Impossible de publier la wave");
        }

        const w = await response.json();
        return mapWave(w);
    } catch (error) {
        console.error("Erreur createWave:", error);
        throw error;
    }
};


export const updateWave = async (
    id: string,
    message: string
): Promise<LocalWave> => {
    try {
        const response = await fetch(`${API_URL}/waves/${id}`, {
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
                errorData.message || "Impossible de mettre à jour la wave"
            );
        }

        const w = await response.json();
        return mapWave(w);
    } catch (error) {
        console.error("Erreur updateWave:", error);
        throw error;
    }
};


export const deleteWave = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/waves/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Impossible de supprimer la wave"
            );
        }
    } catch (error) {
        console.error("Erreur deleteWave:", error);
        throw error;
    }
};
