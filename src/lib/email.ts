import { SendMailOptions } from 'nodemailer';

import { EmailTransport } from '@/config/email.config';

export function sendEmail(options: SendMailOptions) {
  EmailTransport.sendMail(options).catch((error) => {
    console.error(`Failed to send email to ${options.to}`, error);
  });
}
