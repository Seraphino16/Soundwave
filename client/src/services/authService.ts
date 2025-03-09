/**
 * @description Service d'authentification de l'application SoundWave
 * @author SoundWave
 */

const API_URL = "http://localhost:5001";

export const registerUser = async (userData: any) => {
    try {
        console.log("Registering user with data:", userData);
        const response = await fetch(`${API_URL}/users/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Register Error Response:", errorData);
            throw new Error(errorData.message || "Échec de l'enregistrement de l'utilisateur");
        }

        return response.json();
    } catch (error) {
        console.log("Register Error:", error);
        throw error;
    }
};

export const loginUser = async (loginData: any) => {
    try {
        console.log("Logging in user with data:", loginData);
        const response = await fetch(`${API_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Login Error Response:", errorData);
            throw new Error(errorData.message || "Échec de la connexion de l'utilisateur");
        }

        const userData = await response.json();

        localStorage.setItem("user", JSON.stringify(userData));

        return userData;
    } catch (error) {
        throw error;
    }
};