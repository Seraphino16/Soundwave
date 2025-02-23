import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerErrors } from './errors/mailer.errors';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send-validation-email')
  sendValidationEmail(@Body() body: { email: string; token: string }): void {
    const { email, token } = body;

    try {
      return this.mailerService.sendValidationEmail(email, token);
    } catch {
      throw new BadRequestException(MailerErrors.emailNotSent().message);
    }
  }
}
