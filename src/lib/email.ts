import { SendMailOptions } from 'nodemailer';

import { EmailTransport } from '@/config/email.config';
import { EMAIL_DISABLE } from '@/config/environment.config';

export async function singleSendEmail(options: SendMailOptions) {
  if (EMAIL_DISABLE) return;
  try {
    await EmailTransport.sendMail(options);
  } catch (error) {
    console.error(`Failed to send email to ${options.to}`, error);
  }
}

type BatchSendEmailOptions = Omit<SendMailOptions, 'to'> & { to: string[] };

export async function batchSendEmail(options: BatchSendEmailOptions) {
  const { to, ...rest } = options;
  for (const email of to) {
    await singleSendEmail({ ...rest, to: email });
  }
}
