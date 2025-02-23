import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerSuccess } from './success/mailer.success';
import { MailerErrors } from './errors/mailer.errors';

@Injectable()
