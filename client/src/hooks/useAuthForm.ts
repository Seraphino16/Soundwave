import { useState, useEffect } from "react";
import { validateForm } from "../utils/formValidation";

export const useAuthForm = (type: "login" | "register") => {
    const [birthdate, setBirthDate] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [pseudo, setPseudo] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const newErrors = validateForm(type, email, username, pseudo, birthdate, password, confirmPassword);
        setErrors(newErrors);
    }, [email, username, pseudo, birthdate, password, confirmPassword, type]);

    const isFormValid =
        Object.keys(errors).length === 0 &&
        ((type === "register" &&
            email &&
            username &&
            pseudo &&
            birthdate &&
            password &&
            confirmPassword) ||
            (type === "login" && email && password));

    return {
        birthdate,
        setBirthDate,
        email,
        setEmail,
        username,
        setUsername,
        pseudo,
        setPseudo,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        errors,
        isFormValid,
    };
};