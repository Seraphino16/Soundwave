import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { MailerErrors } from './errors/mailer.errors';
import { MailerSuccess } from './success/mailer.success';
import { SendValidationEmailParams } from './interfaces/mailer.interfaces';

@Injectable()
export class MailerService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendValidationEmail({
    to,
    username,
    token,
  }: SendValidationEmailParams): Promise<MailerSuccess | MailerErrors> {
    const validationLink = `http://localhost:5001/users/validate?token=${token}`;

    const html = this.loadTemplate('account-validation', {
      username,
      validationLink,
    });

    if (typeof html !== 'string') {
      return html;
    }

    try {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to,
        subject: 'Validation de votre compte',
        html,
      };

      await this.transporter.sendMail(mailOptions);

      return MailerSuccess.accountValidationEmailSent({
        email: to,
        token,
        validationLink,
      });
    } catch (error) {
      console.error("Erreur d'envoi mail :", error);
      return MailerErrors.emailNotSent();
    }
  }

  async sendSuppressionEmail({
    to,
    username,
  }: SendValidationEmailParams): Promise<MailerSuccess | MailerErrors> {

    const html = this.loadTemplate('account-suppression', {
      username,
    });

    if (typeof html !== 'string') {
      return html;
    }

    try {
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to,
        subject: 'Suppression de votre compte',
        html,
      };

      await this.transporter.sendMail(mailOptions);

      return MailerSuccess.accountSuppressionEmailSent({
        email: to,
      });
    } catch (error) {
      console.error("Erreur d'envoi mail :", error);
      return MailerErrors.emailNotSent();
    }
  }

  private loadTemplate(
    templateName: string,
    context: Record<string, any>,
  ): string | MailerErrors {
    const templatesDir = path.join(__dirname, '..', 'mailer', 'templates');
    const templatePath = path.join(templatesDir, `${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      return MailerErrors.mailTemplateNotFound();
    }

    const source = fs.readFileSync(templatePath, 'utf8');
    const compiled = Handlebars.compile(source);
    return compiled(context);
  }
}
