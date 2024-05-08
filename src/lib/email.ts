import { SendMailOptions } from 'nodemailer';

import { EmailTransport } from '@/config/email.config';

export function sendEmail(options: SendMailOptions) {
  EmailTransport.sendMail(options).catch((error) => {
    console.error(`Failed to send email to ${options.to}`, error);
  });
}

type BatchSendEmailOptions = Omit<SendMailOptions, 'to'> & { to: { email: string; id: string }[] };

export function batchSendEmail(options: BatchSendEmailOptions) {
  const recipientVariables = options.to.reduce(
    (acc, recipient) => {
      acc[recipient.email] = { id: recipient.id };
      return acc;
    },
    {} as Record<string, { id: string }>
  );

  sendEmail({
    ...options,
    to: options.to.map((recipient) => recipient.email),
    headers: {
      'X-Mailgun-Recipient-Variables': JSON.stringify(recipientVariables),
    },
  });
}
