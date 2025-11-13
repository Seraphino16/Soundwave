const API_URL = "http://localhost:5001";

export const registerUser = async (userData: any) => {
    try {
        const response = await fetch(`${API_URL}/users/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Échec de l'enregistrement de l'utilisateur");
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (loginData: any) => {
    try {        
        const response = await fetch(`${API_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Échec de la connexion de l'utilisateur");
        }

        const result = await response.json();
        
        return result;
    } catch (error) {
        console.error("Erreur de connexion:", error);
        throw error;
    }
};