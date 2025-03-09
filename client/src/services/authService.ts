/**
 * @description Service d'authentification de l'application SoundWave
 * @author SoundWave
 */

const API_URL = "http://localhost:5001";

export const registerUser = async (userData: any) => {
    try {
        console.log("Register User Data:", userData);
        const response = await fetch(`${API_URL}/users/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Register Error:", errorData);
            throw new Error("Échec de l'enregistrement de l'utilisateur");
        }

        return response.json();
    } catch (error) {
        console.log("Register Error:", error);
        throw error;
    }
};

export const loginUser = async (loginData: any) => {
    try {
        console.log("Login User Data:", loginData);
        const response = await fetch(`${API_URL}/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Login Error:", errorData);
            throw new Error("Échec de la connexion de l'utilisateur");
        }

        const userData = await response.json();
        console.log("User Data:", userData);

        localStorage.setItem("user", JSON.stringify(userData));

        return userData;
    } catch (error) {
        console.log("Login Error:", error);
        throw error;
    }
};
