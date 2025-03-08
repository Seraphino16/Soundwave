import { useState, useEffect } from "react";
import { validateForm } from "../utils/formValidation";

export const useAuthForm = (type: "login" | "register") => {
    const [birthDate, setBirthDate] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const newErrors = validateForm(type, email, username, displayName, birthDate, password, confirmPassword);
        setErrors(newErrors);
    }, [email, username, displayName, birthDate, password, confirmPassword, type]);

    const isFormValid =
        Object.keys(errors).length === 0 &&
        ((type === "register" &&
            email &&
            username &&
            displayName &&
            birthDate &&
            password &&
            confirmPassword) ||
            (type === "login" && email && password));

    return {
        birthDate,
        setBirthDate,
        email,
        setEmail,
        username,
        setUsername,
        displayName,
        setDisplayName,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        errors,
        isFormValid,
    };
};