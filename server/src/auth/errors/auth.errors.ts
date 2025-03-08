export class AuthErrors {
  status: string;
  code: number;
  message: string;
  data?: any;

  constructor(status: string, code: number, message: string, data?: any) {
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
    data?: any,
  ): AuthErrors {
    return new AuthErrors(status, code, message, data);
  }

  static missingLogin(data?: any): AuthErrors {
    return AuthErrors.createError(
      'error',
      400,
      "L'email ou le username sont requis pour se connecter",
      data,
    );
  }

  static missingPassword(data?: any): AuthErrors {
    return AuthErrors.createError(
      'error',
      400,
      'Votre mot de passe est requis pour vous connecter',
      data,
    );
  }

  static invalidCredentials(data?: any): AuthErrors {
    return AuthErrors.createError(
      'error',
      401,
      "Nom d'utilisateur, email ou mot de passe incorrect",
      data,
    );
  }

  static accountNotActivated(data?: any): AuthErrors {
    return AuthErrors.createError(
      'error',
      401,
      "Votre compte n'est pas activé",
      data,
    );
  }

  static unauthorized(data?: any): AuthErrors {
    return AuthErrors.createError(
        'error',
        401,
        'Accès non autorisé',
        data,
    );
  }
}
