import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerSuccess } from './success/mailer.success';
import { MailerErrors } from './errors/mailer.errors';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST as string,
      port: parseInt(process.env.MAIL_PORT as string, 10),
      secure: false,
      auth: {
        user: process.env.MAIL_USER as string,
        pass: process.env.MAIL_PASS as string,
      },
    });
  }
  sendValidationEmail(userEmail: string, Token: string): void {
    const validationLink = `http://localhost:5001/users/validate?token=${Token}`;
    console.log('Validation link:', validationLink);
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: userEmail,
      subject: 'Validation de votre compte',
      html: `
      <p>Bonjour,</p>
      <p>Pour valider votre compte, cliquez sur le lien suivant :</p>
      <p><a href="${validationLink}" target="_blank">Valider mon compte</a></p>
      <p>Si vous n'avez pas demandé cette validation, veuillez ignorer cet email.</p>
    `,
    };

    this.transporter
      .sendMail(mailOptions)
      .then(() => {
        console.log(`Email de validation envoyé à ${userEmail}`);
        return MailerSuccess.accountValidationEmailSent({
          email: userEmail,
          token: Token,
          validationLink,
        });
      })
      .catch((error: Error) => {
        console.error(
          "Erreur lors de l'envoi du mail de validation:",
          error.message,
        );
        return MailerErrors.emailNotSent();
      });
  }
}
