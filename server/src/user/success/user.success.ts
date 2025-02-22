export class UserSuccess {
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
    return new UserSuccess(status, code, message, data);
  }

  static userCreated(data: any) {
    return UserSuccess.createSuccess(
      'success',
      201,
      'Utilisateur créé avec succès',
      data,
    );
  }
}
