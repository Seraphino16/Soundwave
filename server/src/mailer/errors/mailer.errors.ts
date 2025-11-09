export class MailerErrors extends Error {
  status: string;
  code: number;
  message: string;
  data: any;

  constructor(status: string, code: number, message: string, data: any = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.data = data;
    Object.setPrototypeOf(this, MailerErrors.prototype);
  }

  static createError(
    status: string,
    code: number,
    message: string,
    data: any = null,
  ) {
    return new MailerErrors(status, code, message, data);
  }

  static emailNotSent() {
    return MailerErrors.createError('error', 500, "Échec de l'envoi du mail");
  }

  static invalidEmailAddress() {
    return MailerErrors.createError(
      'error',
      400,
      "L'adresse email est invalide",
    );
  }

  static mailTemplateNotFound() {
    return MailerErrors.createError(
      'error',
      404,
      'Template de mail introuvable',
    );
  }

  static emailServiceUnavailable() {
    return MailerErrors.createError(
      'error',
      503,
      'Le service de mail est temporairement hors service',
    );
  }
}
