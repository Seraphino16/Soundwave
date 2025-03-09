export const isUnderage = (birthdate: string): boolean => {
    const now = new Date();
    const birth = new Date(birthdate);
    const age = now.getFullYear() - birth.getFullYear();
    return age < 13;
};

export const validateForm = (
    type: "login" | "register",
    email: string,
    username: string,
    pseudo: string,
    birthdate: string,
    password: string,
    confirmPassword: string
): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (type === "register") {
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide.";
        if (username.length < 3) newErrors.username = "Nom d'utilisateur trop court.";
        if (!pseudo) newErrors.pseudo = "Pseudo affiché requis.";
        if (!birthdate) newErrors.birthdate = "Date de naissance requise.";
        if (isUnderage(birthdate)) newErrors.birthdate = "Vous devez avoir au moins 13 ans.";
        if (password.length < 6) newErrors.password = "Mot de passe trop court.";
        if (password !== confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    } else {
        if (!email) newErrors.email = "Email ou Nom d'utilisateur requis.";
        if (!password) newErrors.password = "Mot de passe requis.";
    }

    return newErrors;
};

export const getFirstError = (errors: Record<string, string>): string | null => {
    if (errors.email) return errors.email;
    if (errors.username) return errors.username;
    if (errors.pseudo) return errors.pseudo;
    if (errors.birthdate) return errors.birthdate;
    if (errors.password) return errors.password;
    if (errors.confirmPassword) return errors.confirmPassword;
    return null;
};