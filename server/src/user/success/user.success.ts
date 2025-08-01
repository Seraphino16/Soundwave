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
    return this.createSuccess(
      'success',
      201,
      'Utilisateur créé avec succès',
      data,
    );
  }

  static userRoleUpdated(data: any) {
    return this.createSuccess(
      'success',
      200,
      'Le rôle a été ajouté avec succés',
      data,
    );
  }

  static accountValidated() {
    return this.createSuccess(
      'success',
      200,
      'Compte utilisateur validé et activé avec succès',
    );
  }

  static userInfosInsert() {
    return UserSuccess.createSuccess(
      'success',
      200,
      'Informations utilisateur enregistrée avec succès',
    );
  }

  static accountDeleted() {
    return UserSuccess.createSuccess(
      'success',
      200,
      'Compte supprimé avec succèss',
    );
  }
}
