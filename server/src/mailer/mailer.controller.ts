import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerErrors } from './errors/mailer.errors';

@Controller('mailer')
export class MailerController {}
