export class TokenErrors extends Error {
  status: string;
  code: number;
  message: string;
  data?: any;

  constructor(status: string, code: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.data = data;
    Object.setPrototypeOf(this, TokenErrors.prototype);
  }

  static createError(
    status: string,
    code: number,
    message: string,
    data?: any,
  ): TokenErrors {
    return new TokenErrors(status, code, message, data);
  }

  static invalidToken(data?: any): TokenErrors {
    return TokenErrors.createError('error', 401, 'Le token est invalide', data);
  }

  static expiredToken(data?: any): TokenErrors {
    return TokenErrors.createError('error', 401, 'Le token à expiré', data);
  }

  static malformedToken(data?: any): TokenErrors {
    return TokenErrors.createError('error', 400, 'Le token est malformé', data);
  }

  static internalServerError(message: string, data?: any): TokenErrors {
    return TokenErrors.createError('error', 500, message, data);
  }
}
