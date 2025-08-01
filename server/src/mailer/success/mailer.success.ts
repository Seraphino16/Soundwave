export class MailerSuccess {
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

  static createSuccess(
    status: string,
    code: number,
    message: string,
    data: any = null,
  ) {
    return new MailerSuccess(status, code, message, data);
  }

  static mailSent(data: any) {
    return MailerSuccess.createSuccess(
      'success',
      200,
      'Email envoyé avec succès',
      data,
    );
  }

  static accountValidationEmailSent(data: any) {
    return MailerSuccess.createSuccess(
      'success',
      200,
      'Email de validation de compte envoyé avec succès',
      data,
    );
  }

  static passwordResetEmailSent(data: any) {
    return MailerSuccess.createSuccess(
      'success',
      200,
      'Email de réinitialisation du mot de passe envoyé avec succès',
      data,
    );
  }

  static accountSuppressionEmailSent(data: any) {
    return MailerSuccess.createSuccess(
      'success',
      200,
      'Email de suppression de compte envoyé avec succès',
      data,
    );
  }
}
