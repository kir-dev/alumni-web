import { SendMailOptions } from 'nodemailer';

import { EmailTransport } from '@/config/email.config';

export function singleSendEmail(options: SendMailOptions) {
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
