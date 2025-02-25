export class UserErrors {

    static readonly EMAIL_REQUIRED = 'L\'email est requis';
    static readonly EMAIL_INVALID = 'L\'email doit être valide';
    static readonly EMAIL_ALREADY_EXISTS = 'L\'email existe déjà';
    static readonly USER_NOT_FOUND = 'Utilisateur non trouvé';

    static readonly PASSWORD_TOO_SHORT = 'Le mot de passe doit contenir au moins 6 caractères';
    static readonly PASSWORD_UPPERCASE = 'Le mot de passe doit contenir au moins une lettre majuscule';
    static readonly PASSWORD_LOWERCASE = 'Le mot de passe doit contenir au moins une lettre minuscule';
    static readonly PASSWORD_NUMBER = 'Le mot de passe doit contenir au moins un chiffre';
    static readonly PASSWORD_SPECIAL_CHAR = 'Le mot de passe doit contenir au moins un caractère spécial';

    static readonly UNKNOW_ERROR = 'Une erreur inconnue est survenue, veuillez réessayer plus tard';


}