export class UserErrors {
  status: string;
  code: number;
  message: string;
  data: any;

  constructor(status: string, code: number, message: string, data: any = null) {
    this.status = status;
    this.code = code;
    this.message = message;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.data = data;
  }

  static createError(
    status: string,
    code: number,
    message: string,
    data: any = null,
  ) {
    return new UserErrors(status, code, message, data);
  }

  static emailRequired() {
    return UserErrors.createError('error', 400, "L'email est requis");
  }

  static emailInvalid() {
    return UserErrors.createError('error', 400, "L'email doit être valide");
  }

  static emailAlreadyExists() {
    return UserErrors.createError('error', 409, "L'email existe déjà");
  }

  static userNotFound() {
    return UserErrors.createError('error', 404, 'Utilisateur non trouvé');
  }

  static passwordTooShort() {
    return UserErrors.createError(
      'error',
      400,
      'Le mot de passe doit contenir au moins 6 caractères',
    );
  }

  static passwordUppercase() {
    return UserErrors.createError(
      'error',
      400,
      'Le mot de passe doit contenir au moins une lettre majuscule',
    );
  }

  static passwordLowercase() {
    return UserErrors.createError(
      'error',
      400,
      'Le mot de passe doit contenir au moins une lettre minuscule',
    );
  }

  static passwordNumber() {
    return UserErrors.createError(
      'error',
      400,
      'Le mot de passe doit contenir au moins un chiffre',
    );
  }
  static passwordSpecialChar() {
    return UserErrors.createError(
      'error',
      400,
      'Le mot de passe doit contenir au moins un caractère spécial',
    );
  }

  static passwordsDoNotMatch() {
    return UserErrors.createError(
      'error',
      400,
      'Le mot de passe et sa confirmation doivent être identiques',
    );
  }

  static pseudoRequired() {
    return UserErrors.createError('error', 400, 'Le pseudo est requis');
  }

  static usernameRequired() {
    return UserErrors.createError(
      'error',
      400,
      "Le nom d'utilisateur est requis",
    );
  }

  static usernameAlreadyExists() {
    return UserErrors.createError(
      'error',
      409,
      "Le nom d'utilisateur existe déjà",
    );
  }

  static missingRequiredFields() {
    return UserErrors.createError(
      'error',
      400,
      'Des champs requis sont manquants dans la requête',
    );
  }

  static birthdateInvalid() {
    return UserErrors.createError(
      'error',
      400,
      'La date de naissance doit être une date valide (YYYY-MM-DD)',
    );
  }

  static unknownError() {
    return UserErrors.createError(
      'error',
      500,
      'Une erreur inconnue est survenue, veuillez réessayer plus tard',
    );
  }

  static ageTooYoung() {
    return UserErrors.createError(
      'error',
      400,
      "L'utilisateur doit avoir au moins 13 ans",
    );
  }

  static invalidToken(): UserErrors {
    return new UserErrors(
      'error',
      400,
      'Le token est invalide ou déjà utilisé',
    );
  }

  static accountAlreadyActivated(): UserErrors {
    return new UserErrors('error', 400, 'Le compte a déjà été activé');
  }
  static activationFailed(): UserErrors {
    return new UserErrors(
      'error',
      400,
      "L'activation du compte a échoué. Veuillez réessayer.",
    );
  }

  static internalServerError() {
    return UserErrors.createError('error', 500, 'Erreur interne du serveur');
  }

  static alreadyArtistError(): UserErrors {
    return new UserErrors(
      'error',
      409,
      'Ce compte est déja enregistré comme artiste',
    );
  }
}
