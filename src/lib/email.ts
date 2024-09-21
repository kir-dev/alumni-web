import { SendMailOptions } from 'nodemailer';

import { EmailTransport } from '@/config/email.config';
import { EMAIL_DISABLE } from '@/config/environment.config';

export function singleSendEmail(options: SendMailOptions) {
  if (EMAIL_DISABLE) return;
  EmailTransport.sendMail(options).catch((error) => {
    console.error(`Failed to send email to ${options.to}`, error);
  });
}

type BatchSendEmailOptions = Omit<SendMailOptions, 'to'> & { to: string[] };

export function batchSendEmail(options: BatchSendEmailOptions) {
  const { to, ...rest } = options;
  to.forEach((recipient) => {
    singleSendEmail({ to: recipient, ...rest });
  });
}
